declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('portfolio-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/style.css',
        '/src/App.tsx',
        'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700&family=Satoshi:wght@400;500;700&display=swap',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});