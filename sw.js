const CACHE_NAME = 'revers-quiz-v11';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Запрос на version.json НИКОГДА не кэшируем
  if (e.request.url.includes('version.json')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Для всего остального
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
