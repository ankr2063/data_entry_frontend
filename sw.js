const filesToCache = [];

self.addEventListener('install', event => {
   self.skipWaiting();
   event.waitUntil(
     caches.open("harbour")
     .then(cache => {
        return cache.addAll(filesToCache);
     })
   );
});

self.addEventListener('activate', (event) => {
});

self.addEventListener('fetch', (event) => {
}); 