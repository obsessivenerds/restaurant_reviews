var MY_CACHE = 'restaurant-app-s1-v1';
var urlsToCache = ['/', 'index.html', 'restaurant.html', '/css/styles.css', '/js/dbhelper.js', '/js/restaurant_info.js', '/js/main.js', 'data/restaurants.json', 'https://fonts.googleapis.com/css?family=Lato:300,400', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js'];
self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(caches.open(MY_CACHE).then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
    }));
});
self.addEventListener('fetch', function(event) {

    event.respondWith(caches.match(event.request).then(function(response) {
        // Cache hit - return response
        if (response) {
            return response;
        }
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(function(response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }
            var responseToCache = response.clone();
            caches.open(MY_CACHE).then(function(cache) {
                cache.put(event.request, responseToCache);
            });
            return response;
        });
    }));
});
self.addEventListener('activate', function(event) {
    var cacheList = ['offline'];
    event.waitUntil(caches.keys().then(function(cacheNames) {
        return Promise.all(cacheNames.map(function(cacheName) {
            if (cacheList.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
            }
        }));
    }));
});
