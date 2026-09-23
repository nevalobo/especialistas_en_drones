# Changelog

## [Unreleased]

### Fixed
- Catálogo mostraba "especialistasendrones.com refused to connect" en producción: `X-Frame-Options: DENY` bloqueaba que el sitio embebiera su propio PDF en el iframe del visor. Cambiado a `SAMEORIGIN` (mantiene la protección anti-clickjacking pero permite embeds del mismo origen). No se veía en local porque `file://` no aplica los headers de Netlify.

### Added
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
