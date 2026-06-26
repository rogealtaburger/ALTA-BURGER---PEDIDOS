const CACHE_NAME = 'altaburger-kiosco-v1';
const urlsToCache = [
  './',
  './kiosco.html',
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
  // Activar inmediatamente sin esperar
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Limpiar caches antiguos
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-first para la API de Google Sheets (datos dinámicos)
  if (url.hostname.includes('script.google.com') || url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first para assets estáticos
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request);
    })
  );
});
