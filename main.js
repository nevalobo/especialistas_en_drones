document.addEventListener("DOMContentLoaded", function() {

    window.addEventListener('scroll', () => {
    if (window.innerWidth <= 900) {
        const progressBar = document.getElementById("scroll-progress");
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }
    }
});

    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
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

    // --- EFECTO NAV TRANSPARENTE AL HACER SCROLL ---
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        // Si el usuario baja más de 50px, agregamos la clase. Si no, la quitamos.
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    // --- 4. LÓGICA DEL FORMULARIO DE CONTACTO (APPS SCRIPT) ---
    const form = document.getElementById('mi-formulario');
    const btnSubmit = document.getElementById('btn-submit');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyFyXXdt9cvgxojbiIRTI4qO6E_8xvLYxtA4VH_XlfbdPtirromrPTPLPzjygkIgZ83gA/exec'; 

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            btnSubmit.textContent = 'Sincronizando telemetría...';
            btnSubmit.disabled = true;

            const fileInput = document.getElementById('archivo');
            let fileBase64 = '';
            let fileName = '';
            let fileMimeType = '';

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                
                if (file.size > 5 * 1024 * 1024) {
                    alert('El archivo es muy grande. Por favor adjunte un archivo menor a 5MB.');
                    btnSubmit.textContent = 'Enviar Solicitud Técnica';
                    btnSubmit.disabled = false;
                    return;
                }

                fileName = file.name;
                fileMimeType = file.type;
                fileBase64 = await toBase64(file);
                fileBase64 = fileBase64.split(',')[1]; // Limpiamos la cabecera del Base64
            }

            const data = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                mensaje: document.getElementById('mensaje').value,
                archivoNombre: fileName,
                archivoMimeType: fileMimeType,
                archivoBase64: fileBase64
            };

            try {
                const response = await fetch(scriptURL, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
                });

                if(response.ok) {
                    // Evento de conversión para GA4
                    gtag('event', 'generate_lead', { 'event_category': 'Contact', 'event_label': 'Formulario Drones' });

                    // --- EFECTO CLEVER DE DRONES ---
                    btnSubmit.style.backgroundColor = "#25d366"; // Color éxito (verde)
                    btnSubmit.innerHTML = "<span>¡Plan de vuelo recibido! 🛰️</span>";
                    
                    // Cambiamos el mensaje del formulario por uno más profesional
                    const formCard = document.querySelector('.form-card');
                    formCard.innerHTML = `
                        <div style="text-align: center; padding: 40px 20px; animation: fadeIn 0.8s ease;">
                            <svg viewBox="0 0 24 24" width="60" height="60" stroke="#2997ff" stroke-width="2" fill="none" style="margin-bottom: 20px;">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <h3 style="color: var(--text-main); font-size: 1.8rem; margin-bottom: 15px;">Enlace Establecido</h3>
                            <p style="color: var(--text-muted); line-height: 1.6;">
                                Nuestros sistemas han procesado sus coordenadas con éxito. <br>
                                <b>Un especialista técnico revisará sus archivos</b> para preparar el despliegue de su presupuesto. 
                                Recibirá una respuesta en menos de 24 horas.
                            </p>
                            <button onclick="location.reload()" style="margin-top: 30px; background: transparent; border: 1px solid var(--border); color: var(--text-muted); padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                                Enviar otra solicitud
                            </button>
                        </div>
                    `;
                    form.reset();
                } else {
                    throw new Error('Error en respuesta de red');
                }
            } catch (error) {
                alert('Hubo un error al conectar con nuestros servidores. Intente de nuevo más tarde.');
                console.error('Error!', error.message);
            } finally {
                btnSubmit.textContent = 'Enviar Solicitud Técnica';
                btnSubmit.disabled = false;
            }
        });
    }

    // Helper para convertir el archivo a Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });


    // --- OPTIMIZACIÓN DE CONEXIÓN ---
    if (navigator.connection && navigator.connection.saveData) {
        // Si el usuario ahorra datos, detenemos los videos pesados del Hero
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            heroVideo.removeAttribute('autoplay');
            heroVideo.pause();
            console.log("Modo ahorro de datos activo: Video pausado para conservar ancho de banda.");
        }
    }

});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


console.log("%c Especialistas en Drones ", "color: #2997ff; font-size: 20px; font-weight: bold; background: #000; padding: 5px; border-radius: 5px;");
console.log("Ingeniería aérea de precisión lista. ¿Buscando el código fuente? Trabajamos con los mejores estándares.");
