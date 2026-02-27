document.addEventListener("DOMContentLoaded", function() {
    
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

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            btnSubmit.textContent = 'Procesando envío...';
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
                    
                    alert('¡Gracias! Hemos recibido su solicitud técnica. Nos pondremos en contacto pronto.');
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
});