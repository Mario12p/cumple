document.addEventListener('DOMContentLoaded', () => {
    const storybook = document.querySelector('.storybook');
    const slides = document.querySelectorAll('.slide');
    const openBtn = document.getElementById('open-book-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const particleBg = document.querySelector('.particle-background');

    let currentSlide = 0;

    function typewriterEffect(element, text, speed) {
        let i = 0;
        element.innerHTML = '';
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    function showSlide(index) {
        // Desvanecer la página actual
        const currentActiveSlide = document.querySelector('.slide.active');
        if (currentActiveSlide) {
            currentActiveSlide.classList.remove('active');
        }
        
        // Mostrar la nueva página con un retraso
        setTimeout(() => {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                    
                    // Si la página tiene una descripción, activa el efecto de máquina de escribir
                    const captionElement = slide.querySelector('.caption p');
                    if (captionElement) {
                        const originalText = captionElement.getAttribute('data-text');
                        captionElement.innerHTML = ''; // Limpiar el texto antes de escribirlo
                        typewriterEffect(captionElement, originalText, 50);
                    }
                }
            });

            // Ocultar/mostrar botones de navegación principal
            prevBtn.classList.toggle('hidden', index <= 1);
            nextBtn.classList.toggle('hidden', index === slides.length - 1);
        }, 500); 
    }
    
    // Al cargar la página, guarda el texto original de los captions
    slides.forEach(slide => {
        const captionElement = slide.querySelector('.caption p');
        if (captionElement) {
            captionElement.setAttribute('data-text', captionElement.textContent);
        }
    });

    openBtn.addEventListener('click', () => {
        storybook.classList.add('opened');
        setTimeout(() => {
            currentSlide = 1;
            showSlide(currentSlide);
        }, 500); 
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

    // Lógica de partículas
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

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registrado con éxito', reg))
            .catch(err => console.error('Error al registrar Service Worker', err));
    }

    createParticles();
    prevBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
});