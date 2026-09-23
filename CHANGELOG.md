# Changelog

## [Unreleased]

### Added
- Skip-link "Saltar al contenido" y `id="main"` para navegación por teclado; `aria-label` en el nav y en el botón flotante de WhatsApp.
- CTAs en el hero ("Solicitar cotización" / "Ver servicios").
- Validación del formulario en vivo: muestra el nombre del archivo elegido, valida el email al salir del campo, y reporta errores inline (reemplaza los `alert()` nativos). El envío ahora tiene timeout de 20s (`AbortController`).
- Open Graph completo (`og:site_name`, `og:locale`, dimensiones y `alt` de imagen) + Twitter Cards. `hreflang` es-cr y x-default.
- Structured data (JSON-LD) enriquecido: `ProfessionalService` con `@id`, `description`, `priceRange`, `areaServed`, `sameAs` (Instagram/YouTube) y `contactPoint`.
- PWA: manifest completo con iconos PNG 192/512 + maskable, `apple-touch-icon`, y un service worker (`sw.js`) con precache del shell (stale-while-revalidate).
- Content-Security-Policy explícita con allowlist por origen (script/style/font/img/frame/connect), `frame-ancestors 'self'` y `form-action`.
- Visor del catálogo rehecho: portada clickeable (`catalogo-portada.webp`, primera página) que abre el PDF en pestaña nueva — robusto en móvil, sin iframe frágil.
- `preload` del poster del hero con `fetchpriority="high"` (LCP); `preconnect` a arcg.is; `decoding="async"` en fotos del equipo.

### Changed
- `--text-muted` de `#86868b` a `#a1a1a6` para cumplir contraste WCAG AA en texto pequeño.
- Movidos todos los estilos inline a clases CSS (backgrounds del bento, footer legal): `index.html` queda sin `style=` inline.
- Unificado el marcado de la tercera tarjeta de equipo con las otras dos.
- Consolidada la regla duplicada de `.mesh-container`; `console.log` de save-data bajado a `console.debug`; smooth-scroll con null-guard.
- Quitado `X-XSS-Protection` (deprecado; lo reemplaza la CSP).

### Fixed
- Catálogo mostraba "especialistasendrones.com refused to connect" en producción: `X-Frame-Options: DENY` bloqueaba que el sitio embebiera su propio PDF en el iframe del visor. Cambiado a `SAMEORIGIN` (mantiene la protección anti-clickjacking pero permite embeds del mismo origen). No se veía en local porque `file://` no aplica los headers de Netlify.
- El botón de envío ya no destruye su `<span id="btn-text">` y el `onclick` inline de la vista de éxito se reemplazó por un handler (compatible con la CSP).

### Verified
- Todo probado con un servidor local que aplica los headers reales de `_headers` (no `file://`): CSP sin violaciones, GA/GTM operativo, fuente Inter cargando, service worker registrado, catálogo e iconos accesibles.
- `poster` (frame representativo, JPG) para el hero y los 3 videos de pilares, más `preload="none"` en los pilares para no descargarlos hasta que se necesiten. Posters en `media/video/posters/`.
- Hero video hospedado localmente (`media/video/hero-drone-flight.mp4`), eliminando la dependencia del hotlink de imgur.

### Changed
- Recomprimidos los videos con ffmpeg (H.264 CRF 30, escala máx 1280px, sin audio): pilares de ~12.7MB a ~3.8MB (escaneo-lidar 5.7→2.4MB, soluciones 3.8→0.8MB, equipos 3.0→0.6MB); hero de imgur (5.2MB) → local 1.0MB. Carpeta `media/` reducida a ~9MB.
- Headers de sección en móvil ahora son compactos y legibles: h2 reducido (2.2→1.5rem), menos padding, y se quitó el `position: sticky` en móvil (se apilaban y comían viewport).

### Fixed
- "Capacidades Operativas" (y todos los section-header dentro de grids) ahora se centran siempre: se les dio `grid-column: 1 / -1` en la regla general, no solo en `.pilares`. Antes, en anchos intermedios el `auto-fit` metía el header en una sola columna y quedaba descentrado.
- La sección de servicios se veía "tirada a la izquierda" en pantallas anchas: `auto-fit` creaba una 4ª columna huérfana con solo 3 tarjetas. Ahora el grid es fijo de 3 columnas (1 en tablet/móvil). (Nota: un `max-width` inicial acotaba el header de servicios más angosto que los demás; se removió — el grid fijo ya resuelve la huérfana sin él.)
- Quitado el `<link rel="preload">` de `preview.jpg` (se usa solo como og:image, nunca se renderiza en página → el navegador avisaba "preloaded but not used").
- Quitado el `sandbox` de los iframes de ArcGIS (embeds de confianza que requieren scripts + same-origin; la combinación disparaba el warning "can escape its sandboxing" sin aportar seguridad real).

## [2026-09-22] - Catálogo + auditoría fases 1-3

### Added
- Sección de Catálogo (`#catalogo`) con visor PDF embebido, botones de descarga/pantalla completa y enlace en el nav.
- `tools/compress_pdf.py`: compresor de PDF por rasterización de páginas (PyMuPDF + Pillow), ideal para catálogos visuales.
- QRs del sitio en `media/qr/` (PNG, SVG y versión para impresión).
- `preconnect` a Google Fonts y Google Tag Manager para acelerar la primera conexión.
- `<link rel="canonical">` y `<meta name="theme-color">` en `index.html`.
- Utilidades de accesibilidad en `styles.css`: `.sr-only`, `:focus-visible`, `@media (prefers-reduced-motion)`.
- Loader "Cargando modelo 3D…" para los iframes de ArcGIS mientras cargan.
- Menú hamburguesa en móvil (panel desplegable, cierra al tocar un enlace o con Escape).
- HSTS y Permissions-Policy en `_headers`.
- Labels accesibles en el formulario de contacto (con `for`/`id`).
- `privacidad.html` agregada al `sitemap.xml`.
- Sección "Desarrollo Local" y notas de mantenimiento en `README.md`.

### Changed
- Comprimido `catalogo.pdf` de 8.3MB a 3.4MB (rasterización zoom 1.5 / calidad 72).
- Convertidas las imágenes de workflow y equipo a WebP; `preview.png` (1.6MB) → `preview.jpg` (208KB). Carpeta `media/` reducida de ~26MB a ~16MB.
- GA4 se configura una sola vez (en `main.js`, con `anonymize_ip`); se eliminó la config duplicada del `<head>`.
- Unificados los dos listeners de `scroll` en uno solo con `requestAnimationFrame` (throttling).
- `scroll-behavior` movido del selector universal `*` a `html`, con `scroll-padding-top` para el nav fijo.
- `404.html` y `privacidad.html` reescritos con clases CSS en vez de estilos inline.
- `title` descriptivo en los 3 iframes de ArcGIS (antes vacío).
- `width`/`height` + `loading="lazy"` en las fotos del equipo (reduce CLS).

### Fixed
- Ruta rota de `preview.png` corregida (`media/` → `media/images/`) en og:image, preload y JSON-LD.
- El texto del botón de envío ya no destruye el `<span id="btn-text">` (se escribe sobre el span).
- Null-guard del preloader para no romper si el elemento se retira.

### Removed
- `media/video/aerial-drone-flight.mp4` (9.2MB) — no estaba referenciado en el código.
- Archivos de imagen originales (JPG/JPEG/PNG) reemplazados por sus versiones WebP/JPG optimizadas.

## [2026-09-22] - Integración al workspace

### Added
- Integrated project into the Kiro Projects workspace setup: `.kiro/` baseline (steering, universal hooks, settings), `.gitignore`, `MEMORY.md`, `CHANGELOG.md`.
- Added project to `bap.code-workspace` and `~/Projects/PROJECTS.md` index.
- Full technical audit at `docs/AUDIT.md` (performance, code quality, UX/UI, SEO/a11y, security) with a prioritized 4-phase roadmap.

### Changed
- Tailored `.kiro/steering/defaults.md` to the web stack (HTML/CSS/vanilla JS, Spanish content) instead of the Python template default.
