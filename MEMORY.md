# Project Memory

## Overview
Marketing website for **Especialistas en Drones CR** — a drone/geospatial services company in Costa Rica (topography, photogrammetry, LiDAR, industrial inspection, equipment sales). Single-page JAMstack site: static HTML/CSS/vanilla JS, serverless lead form via Google Apps Script (writes leads + file attachments to Google Drive), deployed to Netlify via GitHub CI/CD. Live domain: especialistasendrones.com.

## Current State
- Cloned from GitHub (`nevalobo/especialistas_en_drones`) into the Projects workspace on 2026-09-22 and integrated into the Kiro Projects setup (`.kiro` baseline, MEMORY/CHANGELOG/README, workspace + PROJECTS.md).
- Site is live and functional. Audit at `docs/AUDIT.md`. **Fases 1-3 APLICADAS** (2026-09-22) + sección de catálogo cerrada. Cambios locales SIN commitear aún (pendiente en esta sesión). No hay deploy hasta que el usuario pruebe.
- No build tooling, no package.json, no tests. Pure static assets.

## Trabajo aplicado 2026-09-22 (fases 1-3 + catálogo)
- **Catálogo**: sección `#catalogo` con visor PDF; `catalogo.pdf` comprimido 8.3→3.4MB con `tools/compress_pdf.py` (rasteriza páginas, zoom 1.5/q72). Nota: PyMuPDF `rewrite_images` no rendía (imágenes ~150 DPI); resamplear streams individuales ROMPÍA capas de fondo → por eso el script rasteriza páginas completas (aplana el texto, aceptable para catálogo visual).
- **Fase 1**: preview.png ruta corregida a media/images/ (og/preload/JSON-LD); GA4 config única en main.js; preconnect fonts+GTM; canonical + theme-color; titles en 3 iframes ArcGIS; width/height+lazy en fotos team; form con labels accesibles; HSTS + Permissions-Policy en _headers; borrado aerial-drone-flight.mp4 (9.2MB, sin usar); sitemap +privacidad.html.
- **Fase 2 (imágenes)**: workflow-1/2/3 (resize 1200px) + workflow-4 + team → WebP; preview.png→preview.jpg 208KB.
- **Fase 2 (video) COMPLETA**: usé ffmpeg vía pip `imageio-ffmpeg` (trae binario propio, NO requiere Homebrew ni instalación de sistema; path: `python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"`). Recomprimí los 3 videos de pilares (H.264 CRF 30, escala máx 1280, `-an`) de ~12.7→3.8MB; descargué el hero de imgur y lo hospedé local (`media/video/hero-drone-flight.mp4`, 1MB) eliminando el hotlink; generé posters JPG para hero+3 pilares en `media/video/posters/` y los cableé en el HTML (`poster=` + `preload="none"` en pilares). **media/ final ~9MB** (era ~26MB al inicio). NOTA: `-preset slow` en el hero (20s) se pasó de timeout; usar `-preset medium`.
- **Fase 3**: scroll listeners unificados con rAF; menú hamburguesa móvil (panel desplegable, cierra con link/Escape); :focus-visible, prefers-reduced-motion, scroll-padding-top, loader de iframes; 404.html y privacidad.html sin estilos inline (clases nuevas en styles.css).
- **Verificación**: sin build (sitio estático). `node --check main.js` OK, JSON-LD OK, 0 refs de imagen rotas, menú validado con screenshot headless. `tools/scratch/` es scratch (screenshots + backup del PDF original) — gitignored.

## Audit — top findings (2026-09-22)
- 🔴 `preview.png` path broken: real file is `media/images/preview.png` but `og:image`, JSON-LD image and `<link preload>` all point to `media/preview.png` (404 → no social preview, wasted preload). index.html:16,30,39.
- 🔴 GA4 configured twice (index.html:23 + main.js:29) → doubled analytics.
- 🟠 Hero video hotlinked from imgur; local videos 3–9.2MB (aerial-drone-flight.mp4 9.2MB appears UNUSED — deletable).
- 🟠 Images have no width/height (CLS) nor loading=lazy; `_headers` missing HSTS/Permissions-Policy; CSP is only upgrade-insecure-requests.
- 🟡 iframes without title, file `<label>` without `for`, btn-text span overwritten by textContent.

## Key Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-22 | Integrate as a standard Projects entry (universal hook baseline only, NOT the data profile) | It's a web marketing site, not a data project — no Redshift/Datanet work. |
| 2026-09-22 | Keep steering `defaults.md` web-flavored (HTML/CSS/JS, Spanish content) | Overrides the template's Python default to match the actual stack. |

## Architecture / Structure
- `index.html` — single-page site: hero (video bg), servicios (pilares w/ hover video), workflow (bento grid), entregables (sticky text + lazy ArcGIS iframes), equipo, contacto (form).
- `styles.css` — all styling. Dark theme via CSS vars, glassmorphism, grid/bento layouts, responsive at 900px & 768px.
- `main.js` — scroll progress bar (mobile), preloader, GA4, IntersectionObserver reveals, hover/scroll video playback, nav-on-scroll, contact form → Apps Script (base64 file upload), lazy iframe loader, smooth anchor scroll, save-data video pause.
- `404.html`, `privacidad.html` — secondary pages (heavy inline styles).
- `_headers` — Netlify security headers. `manifest.json` — PWA. `robots.txt`, `sitemap.xml` — SEO.
- `media/` — 4 videos (3–9.2MB), team photos, workflow bg images, favicon. Hero video is hotlinked from imgur, not local.

## Open Questions
- Domain/deploy owned by user; deploy is `git push origin main` → Netlify. No staging environment noted.
- Apps Script endpoint URL is hardcoded in `main.js` (public by nature of client-side form).

## Session Log

| Date | Summary |
|------|---------|
| 2026-09-22 | Cloned repo, integrated into Projects setup, read full source, ran full audit (performance/code/UX/SEO/security). |
| 2026-09-22 | Cerré la sección de catálogo (PDF 8.3→3.4MB) y apliqué auditoría fases 1-3 (bugs preview.png/GA4, WebP, a11y, menú hamburguesa, headers). Fase 2 de video queda pendiente (falta ffmpeg). Commits por bloques. |
| 2026-09-22 | Fase 2 video con ffmpeg (imageio-ffmpeg vía pip): recomprimí videos + hero local. Fixes UI: grid servicios 3 cols, section-headers móvil compactos. Push a producción (usuario). |
| 2026-09-23 | Fix urgente catálogo (X-Frame-Options DENY→SAMEORIGIN) + runbook. Auditoría fase 4+: UX/a11y (contraste AA, form en vivo, CTAs hero, skip-link), SEO/PWA (OG/Twitter, JSON-LD, manifest+iconos, service worker), seguridad/perf (CSP real, fetchpriority hero), visor catálogo→portada+botón, 0 estilos inline. Verificado con server local + headers reales (CSP sin violaciones). |
