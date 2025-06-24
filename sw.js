// A version number for our cache.
// If we change the app (e.g., update the CSS), we can increment this version
// to tell the browser to fetch the new files.
const CACHE_VERSION = 1;
const CACHE_NAME = `bbq-guide-cache-v${CACHE_VERSION}`;

// A list of all the essential files our app needs to run offline.
const FILES_TO_CACHE = [
  '/', // This represents the root index.html file
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'images/icon.svg'
];

// 1. The 'install' event
// This runs when the service worker is first installed.
// We open our cache and add all the essential files to it.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// 2. The 'activate' event
// This runs after the service worker is installed.
// It's a good place to clean up old, outdated caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. The 'fetch' event
// This runs every single time the app requests a resource (like a CSS file, an image, or even the page itself).
// We check if the requested file is in our cache. If it is, we serve it from the cache.
// If it's not, we fetch it from the network.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the file is in the cache, return it.
        if (response) {
          return response;
        }
        // Otherwise, fetch it from the network.
        return fetch(event.request);
      })
  );
});