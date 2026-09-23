document.addEventListener("DOMContentLoaded", function() {

    // --- SCROLL UNIFICADO (barra de progreso móvil + nav opaco), throttleado con rAF ---
    // Un solo listener de scroll para no recalcular layout dos veces por evento.
    const progressBar = document.getElementById("scroll-progress");
    const navEl = document.querySelector('nav');
    let scrollTicking = false;

    function onScroll() {
        // Barra de progreso: solo en pantallas <=900px (donde se muestra)
        if (progressBar && window.innerWidth <= 900) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = (height > 0 ? (winScroll / height) * 100 : 0) + "%";
        }
        // Nav opaco tras 50px de scroll
        if (navEl) {
            navEl.classList.toggle('nav-scrolled', window.scrollY > 50);
        }
        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(onScroll);
            scrollTicking = true;
        }
    }, { passive: true });

    // --- MENÚ HAMBURGUESA (MÓVIL) ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
        const closeMenu = () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        };
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        // Cerrar al tocar un enlace del menú
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (!preloader) return; // guard: no romper si el div se quita
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 500);
    });
    
    // --- 1. CONFIGURACIÓN DE GOOGLE ANALYTICS ---
    // Al asignarlo a 'window', nos aseguramos de que 'gtag' sea global
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    
    gtag('js', new Date());
    gtag('config', 'G-Q9BWERW66V', {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
    });

    // --- 2. ANIMACIONES DE SCROLL (REVEAL) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));


    // --- 3. REPRODUCCIÓN INTELIGENTE DE VIDEOS (PC vs Mobile) ---
    const pilarItems = document.querySelectorAll('.pilar-item');
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    pilarItems.forEach(item => {
        const video = item.querySelector('video');
        if (!video) return;

        if (supportsHover) {
            // Lógica para Desktop (Hover)
            item.addEventListener('mouseenter', () => {
                video.play().catch(error => console.log("Reproducción bloqueada:", error));
            });

            item.addEventListener('mouseleave', () => {
                video.pause();
            });
        } else {
            // Lógica para Mobile (Scroll/Intersection)
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(error => console.log("Error en mobile:", error));
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.6 }); 

            videoObserver.observe(item);
        }
    });

    // --- 4. LÓGICA DEL FORMULARIO DE CONTACTO (APPS SCRIPT) ---
    const form = document.getElementById('mi-formulario');
    const btnSubmit = document.getElementById('btn-submit');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyFyXXdt9cvgxojbiIRTI4qO6E_8xvLYxtA4VH_XlfbdPtirromrPTPLPzjygkIgZ83gA/exec'; 

    // Helper para convertir el archivo a Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // Muestra un mensaje inline en el formulario (reemplaza los alert() nativos).
    const formStatus = document.getElementById('form-status');
    const showFormError = (msg) => {
        if (!formStatus) return;
        formStatus.textContent = msg;
        formStatus.className = 'form-status form-status-error';
    };
    const clearFormStatus = () => {
        if (!formStatus) return;
        formStatus.textContent = '';
        formStatus.className = 'form-status';
    };

    const emailInput = document.getElementById('email');
    const fileInput = document.getElementById('archivo');
    const fileLabel = document.querySelector('.form-file-label');
    const fileLabelDefault = fileLabel ? fileLabel.textContent : '';
    const MAX_FILE = 5 * 1024 * 1024;

    // Feedback en vivo: mostrar el nombre del archivo elegido y validar su tamaño.
    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length === 0) { fileLabel.textContent = fileLabelDefault; clearFormStatus(); return; }
            const f = fileInput.files[0];
            if (f.size > MAX_FILE) {
                showFormError('El archivo supera los 5MB. Por favor adjunte uno más liviano.');
                fileInput.value = '';
                fileLabel.textContent = fileLabelDefault;
            } else {
                clearFormStatus();
                fileLabel.textContent = `Archivo: ${f.name}`;
            }
        });
    }

    // Validación de email al salir del campo (blur).
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !emailInput.checkValidity()) {
                showFormError('Revise el correo electrónico: parece no ser válido.');
            } else {
                clearFormStatus();
            }
        });
    }

    if (form) {
        const btnText = document.getElementById('btn-text');
        const setBtnText = (txt) => { if (btnText) btnText.textContent = txt; };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearFormStatus();

            setBtnText('Sincronizando telemetría...');
            btnSubmit.disabled = true;

            let fileBase64 = '';
            let fileName = '';
            let fileMimeType = '';

            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (file.size > MAX_FILE) {
                    showFormError('El archivo es muy grande. Por favor adjunte un archivo menor a 5MB.');
                    setBtnText('Enviar Solicitud Técnica');
                    btnSubmit.disabled = false;
                    return;
                }
                fileName = file.name;
                fileMimeType = file.type;
                fileBase64 = (await toBase64(file)).split(',')[1]; // quitar cabecera data:
            }

            const data = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                mensaje: document.getElementById('mensaje').value,
                archivoNombre: fileName,
                archivoMimeType: fileMimeType,
                archivoBase64: fileBase64
            };

            // Timeout: si Apps Script cuelga, abortamos a los 20s para no dejar el botón colgado.
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000);

            try {
                const response = await fetch(scriptURL, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    signal: controller.signal
                });

                if (response.ok) {
                    gtag('event', 'generate_lead', { 'event_category': 'Contact', 'event_label': 'Formulario Drones' });
                    renderSuccess();
                    form.reset();
                } else {
                    throw new Error('Error en respuesta de red');
                }
            } catch (error) {
                showFormError('Hubo un error al enviar su solicitud. Intente de nuevo o escríbanos por WhatsApp.');
                console.error('Form submit error:', error.message);
                setBtnText('Enviar Solicitud Técnica');
                btnSubmit.disabled = false;
            } finally {
                clearTimeout(timeout);
            }
        });

        // Construye la vista de éxito con DOM APIs (sin innerHTML ni onclick inline → CSP-safe).
        function renderSuccess() {
            const formCard = document.querySelector('.form-card');
            if (!formCard) return;
            formCard.replaceChildren();

            const wrap = document.createElement('div');
            wrap.className = 'form-success';

            wrap.innerHTML = ''; // limpio por claridad
            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', '60'); svg.setAttribute('height', '60');
            svg.setAttribute('stroke', '#2997ff'); svg.setAttribute('stroke-width', '2'); svg.setAttribute('fill', 'none');
            svg.classList.add('form-success-icon');
            const p1 = document.createElementNS(svgNS, 'path'); p1.setAttribute('d', 'M22 11.08V12a10 10 0 1 1-5.93-9.14');
            const p2 = document.createElementNS(svgNS, 'polyline'); p2.setAttribute('points', '22 4 12 14.01 9 11.01');
            svg.append(p1, p2);

            const h3 = document.createElement('h3'); h3.textContent = 'Enlace Establecido';
            const p = document.createElement('p');
            p.innerHTML = 'Nuestros sistemas han procesado sus coordenadas con éxito.<br><b>Un especialista técnico revisará sus archivos</b> para preparar el despliegue de su presupuesto. Recibirá una respuesta en menos de 24 horas.';
            const btn = document.createElement('button');
            btn.type = 'button'; btn.className = 'form-success-btn'; btn.textContent = 'Enviar otra solicitud';
            btn.addEventListener('click', () => location.reload());

            wrap.append(svg, h3, p, btn);
            formCard.appendChild(wrap);
        }
    }


    // --- OPTIMIZACIÓN DE CONEXIÓN ---
    if (navigator.connection && navigator.connection.saveData) {
        // Si el usuario ahorra datos, detenemos los videos pesados del Hero
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            heroVideo.removeAttribute('autoplay');
            heroVideo.pause();
            console.debug("Modo ahorro de datos activo: Video pausado para conservar ancho de banda.");
        }
    }

});

// --- CARGA DINÁMICA DE ENTREGABLES (ANTI-JUMP) ---
const iframeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const iframe = entry.target.querySelector('iframe');
            if (iframe && iframe.dataset.src) {
                // Inyectamos el src real solo cuando el usuario está frente al contenedor
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
                // Al terminar de cargar, marcamos el contenedor para ocultar el loader "Cargando modelo 3D…"
                iframe.addEventListener('load', () => entry.target.classList.add('loaded'), { once: true });
                // Dejamos de observar este contenedor una vez cargado
                observer.unobserve(entry.target);
            }
        }
    });
}, { 
    threshold: 0.2, // Se carga cuando el 20% del contenedor es visible
    rootMargin: "0px 0px 200px 0px" // Empezamos a cargar 200px antes de llegar para que sea fluido
});

document.querySelectorAll('.mesh-container').forEach(container => {
    iframeObserver.observe(container);
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return; // ignorar anclas vacías
        const target = document.querySelector(href);
        if (!target) return; // null-guard: no romper si el ancla no existe
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});


console.log("%c Especialistas en Drones ", "color: #2997ff; font-size: 20px; font-weight: bold; background: #000; padding: 5px; border-radius: 5px;");
console.log("Ingeniería aérea de precisión lista. ¿Buscando el código fuente? Trabajamos con los mejores estándares.");

// --- SERVICE WORKER (PWA) ---
// Solo sobre http/https (no file://); registra el SW para offline + installability.
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
            console.debug('SW no registrado:', err && err.message);
        });
    });
}
