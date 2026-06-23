const CACHE_NAME = 'altaburger-v1';
const urlsToCache = [
  './ALTA%20-%20BURGER%20---%20Pedidos.html',
  './manifest.json',
  'https://i.imgur.com/jqi35ZA.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
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
