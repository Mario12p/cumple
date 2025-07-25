document.addEventListener('DOMContentLoaded', () => {
    const storybook = document.querySelector('.storybook');
    const openBtn = document.getElementById('open-book-btn');
    const coverSlide = document.getElementById('cover');
    const photoAlbum = document.querySelector('.photo-album-container');

    // Maneja la transición de la portada al álbum
    openBtn.addEventListener('click', () => {
        coverSlide.classList.remove('active');
        // Habilita el scroll vertical
        storybook.style.overflowY = 'scroll';
        // Desplázate directamente al inicio del álbum de fotos
        if (photoAlbum) {
            photoAlbum.scrollIntoView();
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
});
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

// Llama a la función de confeti cuando se llega a la página final
// Puedes llamar a esta función cuando se cumpla la condición.
// En este caso, cuando el usuario abra el álbum, ya que se encuentra de forma vertical.
createConfetti();