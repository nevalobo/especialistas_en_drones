document.addEventListener("DOMContentLoaded", function() {
    
    // 1. --- ANIMACIONES DE SCROLL (REVEAL) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 }); // Se activa cuando el 15% del elemento es visible

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));


    // 2. --- LÓGICA DEL FORMULARIO DE CONTACTO ---
    let submitted = false;
    const form = document.getElementById('mi-formulario');
    const hiddenIframe = document.getElementById('hidden_iframe');

    if (form && hiddenIframe) {
        // Detecta cuando el usuario hace clic en enviar
        form.addEventListener('submit', function() {
            submitted = true;
        });

        // Detecta cuando el iframe oculto termina de cargar la respuesta de Google
        hiddenIframe.addEventListener('load', function() {
            if (submitted) {
                alert('¡Gracias! Hemos recibido su solicitud. Nos pondremos en contacto pronto.');
                window.location.reload(); // Recarga la página para vaciar los campos
            }
        });
    }
});