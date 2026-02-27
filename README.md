# Especialistas en Drones | Inteligencia Aérea & Soluciones Geoespaciales 🛰️

![Versión](https://img.shields.io/badge/Versi%C3%B3n-40%2F10-blueviolet)
![Hosting](https://img.shields.io/badge/Deploy-Netlify-00ad9f)
![Status](https://img.shields.io/badge/Status-Live-success)

Plataforma digital de alto rendimiento para **Especialistas en Drones**, enfocada en la entrega de activos geoespaciales de alta precisión para ingeniería, minería y gestión de activos críticos en Costa Rica.



## 🛠️ Stack Tecnológico

Esta plataforma ha sido construida bajo la arquitectura **JAMstack**, priorizando la velocidad de carga, seguridad y escalabilidad:

* **Frontend:** HTML5 Semántico, CSS3 avanzado (Glassmorphism & Grid Layout) y Vanilla JavaScript (ES6+).
* **Interactividad:** Animaciones optimizadas con `Intersection Observer API` para minimizar el impacto en el CPU.
* **Backend Serverless:** Integración con **Google Apps Script** para el procesamiento de leads y gestión de archivos adjuntos (KML, DWG, PDF) directamente en Google Drive.
* **Infraestructura:** Despliegue continuo (CI/CD) vía **GitHub** a la red de borde (Edge) de **Netlify**.

## 🚀 Características "40/10"

* **UX Adaptativa:** Barra de progreso de lectura (solo móvil) y detección de **Modo Ahorro de Datos** para pausar videos en conexiones lentas.
* **SEO de Nivel Ingeniería:** Implementación de JSON-LD Schema.org para indexación semántica y Open Graph para previsualizaciones sociales premium.
* **Rendimiento Extremo:** Carga diferida (*Lazy Loading*) de iframes pesados y precarga (*Preload*) de activos críticos.
* **Seguridad Blindada:** Encabezados de seguridad configurados (`_headers`) para evitar Clickjacking y XSS.

## 📁 Estructura del Proyecto

```text
├── media/               # Activos multimedia
│   ├── video/           # Backgrounds optimizados (< 3MB)
│   ├── images/          # Assets visuales y fondos workflow
│   │   └── team/        # Retratos del staff (JPEG/WebP)
│   └── favicon.svg      # Identidad visual de pestaña
├── index.html           # Core de la plataforma
├── 404.html             # Manejo de rutas perdidas (GPS Lost)
├── privacidad.html      # Acuerdo de confidencialidad de datos
├── styles.css           # Framework visual y responsive
├── main.js              # Cerebro de telemetría y lógica
├── manifest.json        # Configuración PWA (Instalable)
└── sitemap.xml          # Mapa para Google Search Console

## 📖 Guía de Operaciones y Mantenimiento

### 1. Actualización de Personal
* **Imagen:** Sube la nueva foto a `media/images/team/`. Debe ser cuadrada y optimizada (JPEG o WebP).
* **Código:** Localiza la sección `<section id="equipo">` en `index.html` y actualiza el atributo `src` y los textos descriptivos de los integrantes.

### 2. Gestión de Video y Multimedia
* **Optimización:** Todo video nuevo debe ser comprimido antes de subirlo. Meta de peso: **< 3MB** por archivo para garantizar carga instantánea.
* **Iframes:** Al actualizar modelos 3D de Sketchfab o mapas de ArcGIS, asegúrate de mantener el atributo `loading="lazy"` en la etiqueta `<iframe>` para proteger el rendimiento de carga inicial.

### 3. Sincronización de Correo y DNS
* El dominio utiliza **Microsoft 365**. Si el correo presenta fallas de recepción, verifica la integridad de los registros **MX, SPF y CNAME** en el panel de **Netlify DNS**. 
* **Advertencia:** Nunca elimines los registros de tipo `NETLIFY` (A/AAAA), ya que son los que vinculan el dominio con el servidor de la web.

### 4. Flujo de Despliegue (CI/CD)
Para aplicar cualquier cambio en vivo en la URL oficial, ejecuta la siguiente secuencia en tu terminal:

1. `git add .`
2. `git commit -m "Descripción clara del cambio realizado"`
3. `git push origin main`

*Netlify detectará automáticamente el push y actualizará la red de distribución global en segundos.*