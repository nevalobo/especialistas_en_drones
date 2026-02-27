# Especialistas en Drones | Inteligencia Aérea & Soluciones Geoespaciales 🛰️

![Versión](https://img.shields.io/badge/Versi%C3%B3n-30%2F10-blue)
![Hosting](https://img.shields.io/badge/Deploy-Netlify-00ad9f)
![Status](https://img.shields.io/badge/Status-Live-success)

Plataforma digital de alto rendimiento para **Especialistas en Drones**, enfocada en la entrega de activos geoespaciales de alta precisión para ingeniería, minería y gestión de activos críticos en Costa Rica.



## 🛠️ Stack Tecnológico

Esta plataforma ha sido construida bajo la arquitectura **JAMstack**, priorizando la velocidad de carga, seguridad y escalabilidad:

* **Frontend:** HTML5 Semántico, CSS3 avanzado (Glassmorphism & Grid Layout) y Vanilla JavaScript (ES6+).
* **Interactividad:** Animaciones optimizadas con `Intersection Observer API` para minimizar el impacto en el CPU.
* **Backend Serverless:** Integración con **Google Apps Script** para el procesamiento de leads y gestión de archivos adjuntos (KML, DWG, PDF) directamente en Google Drive.
* **Infraestructura:** Despliegue continuo (CI/CD) vía **GitHub** a la red de borde (Edge) de **Netlify**.

## 🚀 Características "30/10"

* **Transparent to Solid Navbar:** Navegación dinámica que responde al scroll del usuario.
* **Sticky Side Portfolio:** Visualización de entregables 3D (BIM/GIS) con persistencia de texto descriptivo.
* **Modo Ahorro de Datos:** Detección inteligente de la conexión del usuario para pausar activos pesados si la señal es baja.
* **SEO de Nivel Ingeniería:** Implementación de JSON-LD Schema.org para indexación semántica en Google.
* **Seguridad Blindada:** Encabezados de seguridad configurados (`_headers`) y certificado SSL automático.

## 📁 Estructura del Proyecto

```text
├── media/               # Activos optimizados (WebP y Video comprimido)
├── index.html           # Estructura principal optimizada para SEO
├── 404.html             # Manejo inteligente de rutas rotas
├── privacidad.html      # Cobertura legal y confidencialidad
├── styles.css           # Arquitectura de estilos modular
├── main.js              # Lógica de telemetría y procesamiento
├── manifest.json        # Configuración para Progressive Web App (PWA)
└── sitemap.xml          # Mapa del sitio para Google Search Console