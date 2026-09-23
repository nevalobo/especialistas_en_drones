# Auditoría Técnica — Especialistas en Drones

> Fecha: 2026-09-22 · Alcance: performance, código, UX/UI, SEO/accesibilidad, seguridad.
> Sitio estático (HTML/CSS/vanilla JS) + form serverless (Google Apps Script) + Netlify.

Este documento inventaría hallazgos con evidencia (archivo:línea) y recomienda cómo llevar el sitio
a un nivel más pulido ("más tuanis") sin cambiar el stack ni agregar build tooling.

---

## 0. Resumen ejecutivo

El sitio ya está bien planteado: dark theme coherente, glassmorphism, lazy-load de iframes,
IntersectionObserver para reveals, detección de save-data, GA4 y headers de seguridad base.
Es una base sólida. Los problemas grandes NO son de diseño — son de **detalles rotos que restan
credibilidad y performance**:

| # | Severidad | Problema | Impacto |
|---|-----------|----------|---------|
| 1 | 🔴 Alta | `preview.png` referenciada en la ruta equivocada (`media/` en vez de `media/images/`) | Sin preview al compartir en WhatsApp/redes; preload y Schema.org rotos |
| 2 | 🔴 Alta | GA4 inicializado dos veces (index.html + main.js) | Métricas dobladas / pageviews inflados |
| 3 | 🟠 Media | Hero video hotlinkeado desde imgur | Dependencia frágil de terceros, sin cache/control de peso |
| 4 | 🟠 Media | Videos locales de 3–9.2 MB (uno de 9.2 MB sin usar) | Peso del repo y de carga; rompe la meta <3MB del README |
| 5 | 🟠 Media | Imágenes sin `width`/`height` ni `loading="lazy"` | Layout shift (CLS) y carga innecesaria de fotos below-the-fold |
| 6 | 🟠 Media | Headers de seguridad incompletos (sin HSTS, Permissions-Policy) | Superficie de seguridad más amplia de lo necesario |
| 7 | 🟡 Baja | iframes sin `title`, `<label>` sin `for`, sin skip-link | Accesibilidad (a11y) y SEO |
| 8 | 🟡 Baja | `btn-submit.textContent` borra el `<span id="btn-text">` | Deuda menor / bug latente |
| 9 | 🟡 Baja | Estilos inline duplicados en 404.html y privacidad.html | Mantenibilidad |

---

## 1. Bugs concretos (arreglar ya)

### 1.1 🔴 Ruta de `preview.png` rota
El archivo real es `media/images/preview.png`, pero se referencia como `media/preview.png` en tres lugares:

- `index.html:16` — `og:image` → preview social roto (WhatsApp, LinkedIn, Facebook muestran nada).
- `index.html:30` — `<link rel="preload" as="image" href="media/preview.png">` → 404, preload desperdiciado + warning en consola.
- `index.html:39` — `image` de JSON-LD Schema.org → dato estructurado inválido.

**Fix:** cambiar las tres rutas a `media/images/preview.png` (y la absoluta a `.../media/images/preview.png`).
Es el arreglo de mayor retorno del informe: el preview social impacta directo la conversión al compartir el link.

### 1.2 🔴 Doble inicialización de GA4
- `index.html:23` → `gtag('config', 'G-Q9BWERW66V')`
- `main.js:29` → `gtag('config', 'G-Q9BWERW66V', { anonymize_ip, cookie_flags })`

Se dispara dos veces. **Fix:** dejar UNA sola config. Recomiendo mantener la de `main.js` (tiene
`anonymize_ip` — mejor para privacidad/GDPR-CR) y quitar el `gtag('config', ...)` del `<head>`,
conservando solo el `gtag('js', new Date())` y el `<script async>` del loader.

### 1.3 🟡 `btn-text` sobrescrito
El botón es `<button id="btn-submit"><span id="btn-text">…</span></button>` (`index.html:292`),
pero `main.js` hace `btnSubmit.textContent = '...'`, lo que elimina el `<span>`. Hoy funciona por
casualidad. **Fix:** escribir sobre `#btn-text` (`document.getElementById('btn-text').textContent = ...`)
o quitar el span si no se usa.

---

## 2. Performance

### 2.1 Media pesada
```
media/video/aerial-drone-flight.mp4     9.2 MB   ← NO se referencia en el código (peso muerto)
media/video/escaneo-lidar.mp4           5.7 MB
media/video/soluciones-topograficas.mp4 3.7 MB
media/video/equipos-topograficos.mp4    3.0 MB
media/images/preview.png                1.6 MB   ← PNG para og:image; debería ser <300KB
media/images/team/Ana.jpeg              555 KB
media/images/team/Neva.jpeg             498 KB
media/images/workflow-2.jpg             830 KB
```

Recomendaciones:
- **Borrar `aerial-drone-flight.mp4`** si de verdad no se usa (el hero apunta a imgur). Ahorra 9.2 MB.
- **Re-comprimir los 3 videos de pilares** a la meta <3MB (H.264 CRF 28–30, o mejor un `.webm`/VP9 como
  fuente adicional). Son loops de fondo decorativos, no necesitan bitrate alto.
- **Convertir imágenes a WebP** (workflow + team + preview). Suele bajar 60–80% el peso sin pérdida visible.
- **preview.png → <300KB** y idealmente 1200×630 exactos (tamaño canónico de og:image).
- Agregar `poster` a los `<video>` de pilares para que muestren un frame estático antes de reproducir.

### 2.2 Hero video hotlinkeado de imgur
`index.html:81` → `https://i.imgur.com/bRn9FAi.mp4`. Depende de un tercero: si imgur lo borra, cambia
el CDN o rate-limitea, el hero queda en negro. **Fix:** hospedar el video propio (comprimido <3MB) en
`media/video/` con `poster`, o al menos añadir un fallback local.

### 2.3 Render-blocking y conexiones
- Sin `preconnect`. Se conecta en frío a `fonts.googleapis.com`, `fonts.gstatic.com`,
  `googletagmanager.com`, `script.google.com` y `arcg.is`. **Fix:** agregar en `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://www.googletagmanager.com">
  ```
- La fuente Inter se carga sin `&display=swap` optimizado por peso — ya usa `display=swap` (bien).
  Considerar reducir los pesos a los realmente usados (300, 400, 600 — ya está ajustado, ok).

### 2.4 CLS (Cumulative Layout Shift)
Ninguna imagen declara `width`/`height`. En conexiones lentas el layout "salta" al cargar.
**Fix:** añadir dimensiones intrínsecas a cada `<img>` (y `loading="lazy"` a las de equipo, que están
below-the-fold).

---

## 3. Código / Calidad

- **HTML semántico:** bien en general (`<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`). Falta
  jerarquía de encabezados consistente y `<h1>` único garantizado (el hero tiene el `<h1>`, ok).
- **CSS:** limpio y bien comentado, variables coherentes. `scroll-behavior: smooth` está en `*` (línea
  de `* {}`) — mejor moverlo a `html` para no aplicarlo a todos los elementos.
- **JS:** legible y con comentarios. Mejoras:
  - Hay **dos** listeners de `scroll` separados (progress bar y nav). Unificar en uno con
    `requestAnimationFrame` para no calcular layout dos veces por scroll.
  - Los listeners de scroll no están "throttleados" → se ejecutan en cada evento. `rAF` lo resuelve.
  - `preloader` se asume existente (`preloader.style...`) sin null-check; si algún día se quita el div, rompe.
  - El endpoint de Apps Script está hardcodeado (esperable en un form client-side, pero conviene documentarlo).
- **Duplicación:** `404.html` y `privacidad.html` repiten el `<nav>` con estilos inline. Extraer a clases
  en `styles.css` reduce el HTML y unifica el look.

---

## 4. UX / UI

Lo que ya está muy bien: preloader con pulso, reveals al hacer scroll, nav que se opaca al bajar,
bento grid del workflow, sticky del texto de entregables con gradiente, feedback de éxito del form
("Enlace Establecido"), botón flotante de WhatsApp. Es un sitio con personalidad y buen gusto.

Mejoras que lo hacen "más tuanis":
- **Estados de foco visibles:** los links y botones no tienen `:focus-visible` claro. Navegar con teclado
  hoy es casi invisible. Agregar un outline con `--accent-blue` mejora accesibilidad y percepción de calidad.
- **Validación del form en vivo:** hoy solo valida `required` nativo + tamaño de archivo en submit.
  Mostrar el nombre del archivo elegido y validar email en `blur` da sensación premium.
- **Menú móvil:** en <768px el nav se apila en varias filas (funciona, pero se ve cargado). Un menú
  hamburguesa clásico se vería más limpio.
- **Prefers-reduced-motion:** respetar `@media (prefers-reduced-motion: reduce)` desactivando reveals y
  pulsos para usuarios sensibles al movimiento (a11y + pulido).
- **Scroll-margin-top:** al navegar por anclas (#servicios, etc.), el nav fijo tapa el título. Agregar
  `scroll-margin-top` a las secciones lo corrige.
- **Loader de iframes 3D:** mientras carga ArcGIS, el contenedor queda negro. Un spinner o "Cargando
  modelo 3D…" evita que parezca roto.

---

## 5. SEO / Accesibilidad

**SEO — bien:** title/description, keywords, Open Graph, JSON-LD ProfessionalService, sitemap, robots.
**A corregir:**
- `og:image` roto (ver §1.1) — crítico para compartir.
- `sitemap.xml` solo lista la home; `privacidad.html` no está. Agregarla.
- Falta `<meta name="theme-color">` en el HTML (sí está en manifest, pero conviene también en `<head>`).
- Falta `<link rel="canonical">`.
- `lastmod` del sitemap (2026-02-27) quedará desactualizado — actualizar al publicar cambios.

**Accesibilidad:**
- Los 3 iframes de ArcGIS tienen `title=""` vacío (`index.html`). Poner títulos descriptivos
  ("Modelo 3D — Levantamiento topográfico", etc.).
- El `<label>` del file input (`index.html:288`) no tiene `for=` ni el input un `id` asociado vía label.
  Envolver el input en el label o usar `for="archivo"`.
- Los otros inputs usan solo `placeholder`, sin `<label>` — el placeholder no reemplaza al label para
  lectores de pantalla. Agregar labels (pueden ir visualmente ocultos con `.sr-only`).
- Sin "skip to content" link (menor, pero suma).
- Contraste: `--text-muted (#86868b)` sobre negro roza el mínimo AA en textos pequeños; verificar.

---

## 6. Seguridad

`_headers` ya trae `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy` y
`X-XSS-Protection`. Base correcta. Mejoras:

- **HSTS:** agregar `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- **Permissions-Policy:** restringir APIs no usadas, p. ej. `geolocation=(), microphone=(), camera=()`.
- **CSP real:** hoy la `Content-Security-Policy` es solo `upgrade-insecure-requests` (no restringe orígenes).
  Una CSP explícita (script/style/img/frame-src con los dominios usados: Google Fonts, GTM, Apps Script,
  arcg.is, imgur) reduce el riesgo de XSS. Requiere pruebas para no romper los embeds.
- **`X-XSS-Protection`** está deprecado en navegadores modernos; una CSP lo reemplaza. No hace daño dejarlo.
- **Form:** el envío a Apps Script va con `Content-Type: text/plain` (evita preflight CORS). El archivo se
  valida por tamaño (5MB) pero no por tipo real más allá del `accept`. La validación fuerte debe estar en
  el Apps Script (server-side), no confiar en el cliente. Documentar/verificar eso en el backend.

---

## 7. Roadmap sugerido (priorizado)

### Fase 1 — Quick wins (1 sesión, alto impacto, bajo riesgo)
1. Arreglar la ruta de `preview.png` (og:image, preload, JSON-LD). **[bug]**
2. Quitar el GA4 duplicado. **[bug]**
3. Borrar `aerial-drone-flight.mp4` si no se usa (−9.2 MB). **[perf]**
4. Agregar `preconnect` a fonts/GTM. **[perf]**
5. `width`/`height` + `loading="lazy"` en imágenes. **[perf/CLS]**
6. `title` en iframes + `label`/`for` en el form. **[a11y]**
7. HSTS + Permissions-Policy en `_headers`. **[seguridad]**

### Fase 2 — Optimización de media (1 sesión)
8. Re-comprimir los 3 videos de pilares <3MB (+ `poster`).
9. Convertir imágenes a WebP; `preview.png` a <300KB / 1200×630.
10. Hospedar el hero video propio (quitar dependencia de imgur).

### Fase 3 — Pulido UX/código (1–2 sesiones)
11. `:focus-visible`, `prefers-reduced-motion`, `scroll-margin-top`, loader de iframes.
12. Unificar listeners de scroll con `requestAnimationFrame`.
13. Menú hamburguesa en móvil.
14. Extraer estilos inline de 404/privacidad a `styles.css`.
15. `canonical`, `theme-color`, sitemap con privacidad.html.

### Fase 4 — Endurecimiento (opcional)
16. CSP explícita (con testing de embeds).
17. Validación server-side robusta en el Apps Script.

---

## Apéndice — Referencias de evidencia
- `index.html:16,30,39` — rutas rotas de preview.png
- `index.html:23` + `main.js:29` — doble GA4
- `index.html:81` — hero video imgur
- `index.html:247,258,270` — `<img>` sin dimensiones
- `index.html:288` — `<label>` sin `for`
- `index.html:292` + `main.js` — `btn-text` sobrescrito
- `_headers` — headers de seguridad
- Pesos de media: ver §2.1
