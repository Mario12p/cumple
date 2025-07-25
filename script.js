document.addEventListener('DOMContentLoaded', () => {
    const storybook = document.querySelector('.storybook');
    const openBtn = document.getElementById('open-book-btn');
    const coverSlide = document.getElementById('cover');
    const photoItems = document.querySelectorAll('.photo-item');
    const particleBg = document.querySelector('.particle-background');
    const finalPage = document.querySelector('.final-page');
    const openSound = document.getElementById('open-sound');
    const closeBtn = document.getElementById('close-book-btn');
    const parallaxItems = document.querySelectorAll('.parallax-effect');

    // ¡Nuevas líneas para el preloader!
    const preloader = document.getElementById('preloader');
    const imagesToLoad = document.querySelectorAll('img');
    let imagesLoadedCount = 0;

    // Función para ocultar el preloader y mostrar el contenido
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'hidden'; // Asegura que el body no se desplace
        }
    }

    // Comprueba si todas las imágenes están cargadas
    function imageLoaded() {
        imagesLoadedCount++;
        if (imagesLoadedCount >= imagesToLoad.length) {
            // Todos los recursos se han cargado
            // Ocultar preloader después de un pequeño retraso para asegurar una transición suave
            setTimeout(() => {
                hidePreloader();
            }, 500); 
        }
    }

    // Asignar el evento 'load' a cada imagen
    imagesToLoad.forEach(img => {
        if (img.complete) {
            imageLoaded();
        } else {
            img.addEventListener('load', imageLoaded);
            img.addEventListener('error', imageLoaded); // Contar incluso si hay error
        }
    });

    // Fallback por si el evento 'load' no se dispara
    window.addEventListener('load', () => {
        if (imagesLoadedCount < imagesToLoad.length) {
            hidePreloader();
        }
    });

    // Maneja la transición de la portada al álbum
    openBtn.addEventListener('click', () => {
        openSound.play();
        coverSlide.classList.remove('active');
        storybook.classList.add('opened');
        createConfetti();
    });

    // Lógica del efecto Parallax
    storybook.addEventListener('scroll', () => {
        parallaxItems.forEach(item => {
            const speed = parseFloat(item.dataset.speed) || 0.5;
            const y = (storybook.scrollTop * speed) * -1;
            item.style.transform = `translateY(${y}px)`;
        });
    });

    // Lógica para el botón de cerrar
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            location.reload();
        });
    }

    // Crear partículas de fondo
    function createParticles() {
        for (let i = 0; i < 50; i++) {
            let particle = document.createElement('div');
            particle.className = 'particle';
            let size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
            particleBg.appendChild(particle);
        }
    }

    // Función para crear confeti
    function createConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) return;

        for (let i = 0; i < 100; i++) {
            let confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confetti.style.transform = `scale(${Math.random() + 0.5})`;
            confettiContainer.appendChild(confetti);
        }
    }

    // Observador para la animación de entrada de las fotos
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    photoItems.forEach(item => {
        observer.observe(item);
    });

    createParticles();

    // Registrar el Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registrado con éxito', reg))
            .catch(err => console.error('Error al registrar Service Worker', err));
    }
}); 