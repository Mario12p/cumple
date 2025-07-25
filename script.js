document.addEventListener('DOMContentLoaded', () => {
    const storybook = document.querySelector('.storybook');
    const openBtn = document.getElementById('open-book-btn');
    const coverSlide = document.getElementById('cover');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const particleBg = document.querySelector('.particle-background');

    let currentPage = 0;

    // Función para mostrar la página actual
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');

        // Muestra/oculta botones de navegación
        prevBtn.style.display = index === 0 ? 'none' : 'block';
        nextBtn.style.display = index === slides.length - 1 ? 'none' : 'block';

        // Llama a la animación de confeti en la última página
        if (index === slides.length - 1) {
            createConfetti();
        }
    }

    // Maneja la transición de la portada al álbum
    openBtn.addEventListener('click', () => {
        coverSlide.classList.remove('active');
        storybook.style.overflowY = 'hidden'; // Asegura que no haya scroll
        currentPage = 1; // La primera página de fotos es el índice 1
        showSlide(currentPage);
    });

    // Navegación con los botones
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showSlide(currentPage);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < slides.length - 1) {
            currentPage++;
            showSlide(currentPage);
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

    createParticles();

    // Registrar el Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registrado con éxito', reg))
            .catch(err => console.error('Error al registrar Service Worker', err));
    }
});