const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const MAX_DYNAMIC_ITEMS = 50;

const STATIC_ASSETS = ['/'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Only handle GET requests to prevent CSRF
  if (request.method !== 'GET') return;
  
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;
  
  // Validate request mode
  if (request.mode === 'navigate' && request.method !== 'GET') return;

  // Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (!response || response.status !== 200) return response;

        const clone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, clone);
          cache.keys().then((keys) => {
            if (keys.length > MAX_DYNAMIC_ITEMS) {
              cache.delete(keys[0]);
            }
          });
        });
        return response;
      });
    })
  );
});

self.addEventListener('message', (e) => {
  // Validate message origin to prevent CSRF
  if (!e.origin || e.origin !== self.location.origin) return;
  
  if (e.data?.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
