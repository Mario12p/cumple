document.addEventListener('DOMContentLoaded', () => {
    const storybook = document.querySelector('.storybook');
    const openBtn = document.getElementById('open-book-btn');
    const coverSlide = document.getElementById('cover');
    const photoItems = document.querySelectorAll('.photo-item');
    const particleBg = document.querySelector('.particle-background');
    const finalPage = document.querySelector('.final-page');
    const openSound = document.getElementById('open-sound');

    // Elementos de la nueva sorpresa final
    const birthdayVideo = document.getElementById('birthday-video');
    const finalMessageContainer = document.getElementById('final-message-container');
    const surpriseMessageContainer = document.getElementById('surprise-message');
    const surpriseBtn = document.getElementById('surprise-btn');
    const reloadBtn = document.getElementById('reload-btn');

    // Elementos del efecto "rasca y gana"
    const scratchCanvas = document.getElementById('scratch-canvas');
    let ctx = null;
    let isScratching = false;

    // ¡Nuevas líneas para el preloader!
    const preloader = document.getElementById('preloader');
    const imagesToLoad = document.querySelectorAll('img');
    let imagesLoadedCount = 0;

    // AHORA EL CONTENEDOR DEL MENSAJE FINAL SIEMPRE ES VISIBLE
    finalMessageContainer.classList.remove('hidden');

    // Función para ocultar el preloader y mostrar el contenido
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    // Comprueba si todas las imágenes están cargadas
    function imageLoaded() {
        imagesLoadedCount++;
        if (imagesLoadedCount >= imagesToLoad.length) {
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
            img.addEventListener('error', imageLoaded); 
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

    
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', () => {
            finalMessageContainer.classList.add('hidden');
            setTimeout(() => {
                surpriseMessageContainer.classList.remove('hidden');
                initScratchCard();
            }, 1000); // Pequeño retraso para la transición
        });
    }

    // Lógica para el botón de recargar
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            location.reload();
        });
    }

    // Código del efecto "rasca y gana"
    const touchMoveListener = (e) => {
        e.preventDefault(); // Evita el scroll
        scratch(e.touches[0]);
    };
    const touchEndListener = () => {
        stopScratching();
    };

    function getCoords(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / (rect.right - rect.left) * scratchCanvas.width,
            y: (e.clientY - rect.top) / (rect.bottom - rect.top) * scratchCanvas.height
        };
    }

    function initScratchCard() {
        if (!scratchCanvas) return;
        
        ctx = scratchCanvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Llenar el canvas con una capa para rascar
        const gradient = ctx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
        gradient.addColorStop(0, '#8a2387');
        gradient.addColorStop(0.5, '#e94057');
        gradient.addColorStop(1, '#f27121');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        // Estilos para la brocha de "borrar"
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 40; // Tamaño de la brocha
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Eventos para el mouse
        scratchCanvas.addEventListener('mousedown', startScratching);
        scratchCanvas.addEventListener('mousemove', scratch);
        scratchCanvas.addEventListener('mouseup', stopScratching);

        // Eventos para el tacto (corregido)
        scratchCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startScratching(e.touches[0]);
        });
        scratchCanvas.addEventListener('touchmove', touchMoveListener);
        scratchCanvas.addEventListener('touchend', touchEndListener);
    }

    function resizeCanvas() {
        const rect = surpriseMessageContainer.getBoundingClientRect();
        scratchCanvas.width = rect.width;
        scratchCanvas.height = rect.height;
        
        // Redibujar la capa de rasca y gana al cambiar el tamaño
        const gradient = ctx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
        gradient.addColorStop(0, '#8a2387');
        gradient.addColorStop(0.5, '#e94057');
        gradient.addColorStop(1, '#f27121');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 40;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    function startScratching(e) {
        isScratching = true;
        ctx.beginPath();
        const coords = getCoords(e);
        ctx.moveTo(coords.x, coords.y);
    }

    function scratch(e) {
        if (!isScratching) return;
        const coords = getCoords(e);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();

        // Comprobar si se ha rascado lo suficiente
        if (checkScratchCompletion()) {
            finishScratching();
        }
    }

    function stopScratching() {
        isScratching = false;
    }

    function checkScratchCompletion() {
        const pixels = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const totalPixels = pixels.data.length / 4;
        let transparentPixels = 0;
        for (let i = 0; i < pixels.data.length; i += 4) {
            if (pixels.data[i + 3] === 0) {
                transparentPixels++;
            }
        }
        return (transparentPixels / totalPixels) > 0.4; // 40% rascado para revelar
    }

    function finishScratching() {
        // Eliminar todos los listeners
        scratchCanvas.removeEventListener('mousedown', startScratching);
        scratchCanvas.removeEventListener('mousemove', scratch);
        scratchCanvas.removeEventListener('mouseup', stopScratching);
        scratchCanvas.removeEventListener('touchstart', (e) => { e.preventDefault(); startScratching(e.touches[0]); });
        scratchCanvas.removeEventListener('touchmove', touchMoveListener);
        scratchCanvas.removeEventListener('touchend', touchEndListener);
        window.removeEventListener('resize', resizeCanvas);

        // Ocultar el canvas y mostrar el mensaje final y el botón
        scratchCanvas.style.opacity = '0';
        reloadBtn.classList.remove('hidden');
    }
    // Fin del código del efecto "rasca y gana"

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