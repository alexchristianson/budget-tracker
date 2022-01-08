let siteCache = "site-cache-v4";
let dataCache = "data-cache-v4";

const cacheURL = [
    "./js/idb.js",
    "./js/index.js",
    "./manifest.json",
    "./css/styles.css",
    "./index.html"
]

self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(siteCache).then(cache => {
            console.log('Your files were pre-cached successfully!');
            return cache.addAll(cacheURL);
        })
    );
    
    self.skipWaiting();
});

self.addEventListener('fetch', function(evt) {
    if (evt.request.url.includes('/api/')) {
        evt.respondWith(
            caches
            .open(dataCache)
            .then(cache => {
                return fetch(evt.request)
                .then(response => {
                    console.log("Response", response);
                    // if the response was good, clone it and store it in the cache
                    if (response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    // network request failed, try to get it from the cache
                    return cache.match(evt.request);
                });
            })
            .catch(err => console.log(err))
        );

        return;
    }
    
    evt.respondWith(
        fetch(evt.request).catch(function() {
            return caches.match(evt.request).then(function(response) {
                if (response) {
                    return response;
                } else if (evt.request.headers.get('accept').includes('text/html')) {
                    // return the cached homepage for all requests for html pages
                    return caches.match('/');
                }
            });
        })
    );
});