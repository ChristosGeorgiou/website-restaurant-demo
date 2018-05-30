//This is the service worker with the Cache-first network

var CACHE = 'pwabuilder-precache';
var precacheFiles = [
  '/index.html',
  '/manifest.json',
  '/order-complete.html',
  '/order-new.html',
  '/order-payment.html',
  '/reservation.html',
  '/reservations.html',
  '/settings.html',
  '/statistics.html',
  '/table-settings.html',
  '/table.html',
  '/tables.html',
  '/css/style.css',
  '/css/style.min.css',
  '/en/index.html',
  '/en/order-complete.html',
  '/en/order-new.html',
  '/en/order-payment.html',
  '/en/reservation.html',
  '/en/reservations.html',
  '/en/settings.html',
  '/en/statistics.html',
  '/en/table-settings.html',
  '/en/table.html',
  '/en/tables.html',
  '/icons/restaurant/flaticon.css',
  '/icons/restaurant/Flaticon.eot',
  '/icons/restaurant/flaticon.html',
  '/icons/restaurant/Flaticon.svg',
  '/icons/restaurant/Flaticon.ttf',
  '/icons/restaurant/Flaticon.woff',
  '/icons/restaurant/_flaticon.scss',
  '/icons/summer/flaticon.css',
  '/icons/summer/Flaticon.eot',
  '/icons/summer/flaticon.html',
  '/icons/summer/Flaticon.svg',
  '/icons/summer/Flaticon.ttf',
  '/icons/summer/Flaticon.woff',
  '/icons/summer/_flaticon.scss',
  '/icons/font-awesome/css/font-awesome.css',
  '/icons/font-awesome/css/font-awesome.min.css',
  '/icons/font-awesome/fonts/fontawesome-webfont.eot',
  '/icons/font-awesome/fonts/fontawesome-webfont.svg',
  '/icons/font-awesome/fonts/fontawesome-webfont.ttf',
  '/icons/font-awesome/fonts/fontawesome-webfont.woff',
  '/icons/font-awesome/fonts/fontawesome-webfont.woff2',
  '/icons/font-awesome/fonts/FontAwesome.otf',
  '/icons/font-awesome/less/animated.less',
  '/icons/font-awesome/less/bordered-pulled.less',
  '/icons/font-awesome/less/core.less',
  '/icons/font-awesome/less/fixed-width.less',
  '/icons/font-awesome/less/font-awesome.less',
  '/icons/font-awesome/less/icons.less',
  '/icons/font-awesome/less/larger.less',
  '/icons/font-awesome/less/list.less',
  '/icons/font-awesome/less/mixins.less',
  '/icons/font-awesome/less/path.less',
  '/icons/font-awesome/less/rotated-flipped.less',
  '/icons/font-awesome/less/screen-reader.less',
  '/icons/font-awesome/less/stacked.less',
  '/icons/font-awesome/less/variables.less',
  '/icons/font-awesome/scss/font-awesome.scss',
  '/icons/font-awesome/scss/_animated.scss',
  '/icons/font-awesome/scss/_bordered-pulled.scss',
  '/icons/font-awesome/scss/_core.scss',
  '/icons/font-awesome/scss/_fixed-width.scss',
  '/icons/font-awesome/scss/_icons.scss',
  '/icons/font-awesome/scss/_larger.scss',
  '/icons/font-awesome/scss/_list.scss',
  '/icons/font-awesome/scss/_mixins.scss',
  '/icons/font-awesome/scss/_path.scss',
  '/icons/font-awesome/scss/_rotated-flipped.scss',
  '/icons/font-awesome/scss/_screen-reader.scss',
  '/icons/font-awesome/scss/_stacked.scss',
  '/icons/font-awesome/scss/_variables.scss',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png',
  '/images/icons/icon-72x72.png',
  '/images/icons/icon-96x96.png',
  '/js/Chart.bundle.js'
];

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function (evt) {
  console.log('[PWA Builder] The service worker is being installed.');
  evt.waitUntil(precache().then(function () {
    console.log('[PWA Builder] Skip waiting on install');
    return self.skipWaiting();
  }));
});


//allow sw to control of current page
self.addEventListener('activate', function (event) {
  console.log('[PWA Builder] Claiming clients for current page');
  return self.clients.claim();
});

self.addEventListener('fetch', function (evt) {
  console.log('[PWA Builder] The service worker is serving the asset.' + evt.request.url);
  evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
  evt.waitUntil(update(evt.request));
});


function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(precacheFiles);
  });
}

function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  //this is where we call the server to get the newest version of the 
  //file to use the next time we show view
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

function fromServer(request) {
  //this is the fallback if it is not in the cache to go to the server and get it
  return fetch(request).then(function (response) {
    return response
  });
}