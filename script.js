document.addEventListener('DOMContentLoaded', () => {
    const storybook = document.querySelector('.storybook');
    const slides = document.querySelectorAll('.slide');
    const openBtn = document.getElementById('open-book-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const particleBg = document.querySelector('.particle-background');

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });

        // Ocultar/mostrar botones de navegación
        prevBtn.classList.toggle('hidden', index === 1); // Se oculta en la primera página de fotos
        nextBtn.classList.toggle('hidden', index === slides.length - 1);
    }
    
    openBtn.addEventListener('click', () => {
        currentSlide = 1;
        storybook.classList.add('opened');
        showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 1) {
            currentSlide--;
            showSlide(currentSlide);
        }
    });

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

    // Registrar el Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registrado con éxito', reg))
            .catch(err => console.error('Error al registrar Service Worker', err));
    }

    createParticles();
    // Inicialmente ocultar botones hasta abrir el libro
    prevBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
});