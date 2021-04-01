
const DATA_CACHE_NAME = "data-cache-v2";
const CACHE_NAME = "static-cache-v2";
const FILES_TO_CACHE = [
    "/",
    "/db.js",
    "/index.js",
    "/index.html",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];


self.addEventListener("install", function (evt) {
    evt.waitUnitl(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});


//     );
//     self.clients.claim();
// });


self.addEventListener("fetch", function (evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(err => {
                        return cache.match(evt.request);
                    });
            }).catch(err => console.log(err))
        );
        return;
    }

    evt.respondWith(
        caches.match(evt.request).
            then(function (response) {
                return response || fetch(evt.request);
            })
    );
});
