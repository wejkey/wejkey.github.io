self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('map-cache').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js',
                'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
            ]);
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request).then(function (networkResponse) {
                // Cache the response dynamically for future use
                caches.open('map-cache').then(function (cache) {
                    cache.put(e.request, networkResponse);
                });
                return networkResponse;
            });
        })
    );
});
