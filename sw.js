// --- PWA Service Worker (Gallery) ---
const VERSION = 'v3';                           // bump when you deploy
const SHELL_CACHE   = `gallery-shell-${VERSION}`;
const RUNTIME_CACHE = `gallery-runtime-${VERSION}`;

// Precache your wrapper (same-origin) assets only.
// NOTE: The Apps Script UI loads in an iframe and remains network-first.
const ASSETS = [
  '/',                   // for GitHub Pages root
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Quick install & activate
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![SHELL_CACHE, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Utility: stale-while-revalidate for same-origin runtime requests
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then((resp) => {
    // Only cache successful, basic or opaque responses
    if (resp && (resp.type === 'basic' || resp.type === 'opaque') && resp.status < 400) {
      cache.put(request, resp.clone());
    }
    return resp;
  }).catch(() => cached); // if offline, fall back to cached (if any)
  return cached || networkPromise;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Leave cross-origin (Apps Script iframe) strictly network-first
  if (url.origin !== location.origin) return;

  // Precached shell: cache-first
  if (ASSETS.some((a) => new URL(a, location.origin).pathname === url.pathname)) {
    event.respondWith(
      caches.match(req).then((r) => r || fetch(req))
    );
    return;
  }

  // Icons & other same-origin images: stale-while-revalidate
  if (req.destination === 'image' || url.pathname.startsWith('/icons/')) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
    return;
  }

  // Everything else same-origin (CSS/JS in wrapper): cache-first fallback
  event.respondWith(
    caches.match(req).then((r) => r || fetch(req).then((resp) => {
      // opportunistically cache
      const copy = resp.clone();
      caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
      return resp;
    }).catch(() => r)) // if offline & not cached -> undefined (default error)
  );
});

// Optional: allow page to request immediate activation
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
