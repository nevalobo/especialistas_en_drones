/*
 * sw.js — Service Worker mínimo para Especialistas en Drones.
 *
 * Qué hace:
 *   - Precachea el "shell" del sitio (HTML/CSS/JS/icono) en install.
 *   - Sirve navegaciones y estáticos con estrategia stale-while-revalidate:
 *     responde rápido desde cache y actualiza el cache en segundo plano.
 *   - NO cachea el PDF ni los videos (pesados y poco cambiantes): van a red.
 *
 * IMPORTANTE: subí CACHE_VERSION en cada deploy que cambie el shell, para que
 * los clientes descarten el cache viejo (activate borra caches con otra versión).
 */
const CACHE_VERSION = 'esp-drones-v1';
const SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/media/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Solo GET del mismo origen; dejamos pasar todo lo demás (GA, ArcGIS, Apps Script, videos, PDF).
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/media/video/') || url.pathname.startsWith('/media/catalogo/')) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req).then((res) => {
        if (res && res.status === 200) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
