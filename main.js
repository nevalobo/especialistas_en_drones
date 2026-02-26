document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. CONFIGURACIÓN DE GOOGLE ANALYTICS ---
    // Lo ponemos al principio para que rastree la visita desde el segundo cero
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
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


    // --- 3. LÓGICA DEL FORMULARIO DE CONTACTO CON ARCHIVOS ---
    const form = document.getElementById('mi-formulario');
    const btnSubmit = document.getElementById('btn-submit');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxd2zQ02YdaOb2okmz68EFrKyNgHs2r7xjwpmOhz5qFewDdmceOvAdcJK3YJQAZW9CnTQ/exec'; 

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
                fileBase64 = fileBase64.split(',')[1];
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
                    
                    alert('¡Gracias! Hemos recibido su solicitud. Nos pondremos en contacto pronto.');
                    form.reset();
                } else {
                    throw new Error('Error en respuesta de red');
                }
            } catch (error) {
                alert('Hubo un error al conectar con el servidor. Intente de nuevo más tarde.');
                console.error('Error!', error.message);
            } finally {
                btnSubmit.textContent = 'Enviar Solicitud Técnica';
                btnSubmit.disabled = false;
            }
        });
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
});