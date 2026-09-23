# Troubleshooting — Catálogo: "refused to connect" en el visor PDF

## Overview
El visor del catálogo (`#catalogo`) embebe el PDF propio del sitio con
`<iframe src="media/catalogo/catalogo.pdf">`. En producción mostraba
**"especialistasendrones.com refused to connect."** y el marco quedaba vacío.

## Prerequisites
- El sitio se sirve en Netlify con los headers definidos en `_headers`.
- El visor es un iframe que carga un recurso del MISMO origen (el PDF del sitio).

## Root cause
`_headers` declaraba `X-Frame-Options: DENY`. Ese header prohíbe que la página
sea embebida en CUALQUIER iframe — incluido un iframe del propio sitio cargando
su propio recurso. Por eso el navegador rechazó la conexión del visor.

Por qué no se vio en local: al abrir `index.html` con `file://`, Netlify no
aplica el archivo `_headers`, así que el iframe cargaba sin restricción. El fallo
solo aparece cuando el sitio se sirve desde Netlify (producción).

## Fix
Cambiar `DENY` por `SAMEORIGIN` en `_headers`:

```
X-Frame-Options: SAMEORIGIN
```

`SAMEORIGIN` mantiene la protección anti-clickjacking (ningún sitio externo puede
embeber el nuestro) pero permite que el propio sitio embeba sus recursos.

## Troubleshooting table

| Error | Cause | Fix |
|-------|-------|-----|
| Iframe muestra "refused to connect" (mismo origen) | `X-Frame-Options: DENY` bloquea todo framing, incl. self-embed | Cambiar a `X-Frame-Options: SAMEORIGIN` en `_headers` |
| Bug no reproducible en local pero sí en prod | `file://` no aplica el archivo `_headers` de Netlify | Probar contra el deploy de Netlify (o un server local que envíe los headers), no `file://` |
| PDF embebido se ve gris/vacío en móvil (aunque el header ya permita el frame) | Safari iOS y varios Android NO renderizan PDF inline en iframe | Ofrecer portada (imagen) + botón "Abrir/Descargar"; no depender del render inline |

## Reference
- Fix aplicado en commit `8eca2f3`.
- Archivo: `_headers`.
- Header alternativo moderno: `Content-Security-Policy: frame-ancestors 'self'`
  (si se agrega una CSP con `frame-ancestors`, ésta prevalece sobre `X-Frame-Options`).
