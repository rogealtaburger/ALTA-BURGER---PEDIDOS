const CACHE_NAME = 'altaburger-v2';
const urlsToCache = [
  './',
  './manifest.json',
  './logo-alta-burger.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Caching resiliente: si un archivo falla, no frena el resto
      return Promise.allSettled(
        urlsToCache.map(url => cache.add(url).catch(err => console.warn('No se pudo cachear:', url)))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return from cache if available
        }
        return fetch(event.request);
      })
  );
});
