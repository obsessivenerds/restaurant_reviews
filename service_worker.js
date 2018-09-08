var myCache = 'restaurant-app-s1-v1';
var urlsToCache = ['/', '/index.html', '/restaurant.html', '/css/styles.css', '/js/dbhelper.js', '/js/restaurant_info.js', '/js/main.js', 'data/restaurants.json', 'https://fonts.googleapis.com/css?family=Lato:300,400', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js'];

self.addEventListener('install', function(event) {
  console.log('SW installed!');
  // installation steps
  event.waitUntil(caches.open(myCache).then(function(cache) {
    console.log('Opened cache');
    return cache.addAll(urlsToCache);
  }));
});
//Thanks to Matthew Cranford for the service worker tutorial - https://matthewcranford.com/restaurant-reviews-app-walkthrough-part-4-service-workers/
self.addEventListener('fetch', function(event) {
  console.log('SW fetching');

  event.respondWith(
    caches.match(event.request).then(function(response) {
    // Cache hits - return response
    if (response) {
      console.log('Found ', event.request, ' in cache!');
      return response;
    } else {
      console.log('Could not find ', event.request, ' in cache!');
      return fetch(event.request)
      .then(function(response) {
        const clonedResponse = response.clone();
        caches.open(myCache).then(function(cache) {
          cache.put(event.request, clonedResponse);
        })
        return response;
      })
      .catch(function(err) {
        console.error(err);
      });
    }
  }));
});

self.addEventListener('activate', function(event) {
  console.log('SW activated');

  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.filter(function(cacheName) {
      return cacheName != myCache;
    }).map(function(cacheName) {
      console.log('SW clear cache');
      return caches.delete(cacheName);
    }));
  }));
});
