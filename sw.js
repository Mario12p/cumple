const CACHE_NAME = 'regalo-cumple-cache-v1';

// ★★★ AÑADE AQUÍ LAS RUTAS A TODAS TUS FOTOS ★★★
const urlsToCache = [
    '/',
    '/index.html',
    '/estilo.css',
    '/script.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css',
    '/iconos/icono1.png',
    '/iconos/icono2.png',
    '/IMAGENES/foto1.jpeg',
    '/IMAGENES/foto2.jpeg',
    '/IMAGENES/foto3.jpeg'
   
];
// =================================================

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si está en caché, lo devuelve. Si no, lo busca en la red.
                return response || fetch(event.request);
            })
    );
});