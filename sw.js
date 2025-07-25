const CACHE_NAME = 'mario-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/estilo.css',
    '/script.js',
    '/manifest.json',
    '/iconos/icono1.png',
    '/IMAGENES/foto1.jpeg',
    '/IMAGENES/foto2.jpeg',
    '/IMAGENES/foto3.jpeg',
    '/IMAGENES/foto4.jpeg',
    '/IMAGENES/foto5.jpeg',
    // Recursos de Font Awesome y otros, para que el Service Worker sepa que debe intentarlos
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/webfonts/fa-solid-900.ttf',
];

// Instalar Service Worker e iniciar caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Cachear y servir recursos
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el recurso está en caché, lo servimos
                if (response) {
                    return response;
                }
                
                // Si no, hacemos una nueva solicitud de red
                const fetchRequest = event.request.clone();
                return fetch(fetchRequest)
                    .then(response => {
                        // Si la solicitud no es válida, la ignoramos
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clonamos la respuesta porque la original es un stream y solo se puede leer una vez
                        const responseToCache = response.clone();
                        
                        // Abrimos el caché y guardamos la nueva respuesta
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Si falla la red (porque la fuente no está en caché y no hay internet),
                        // podemos devolver una respuesta de fallback.
                        // En este caso, no hacemos nada, simplemente la fuente no se cargará.
                    });
            })
    );
});

// Eliminar cachés viejos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});