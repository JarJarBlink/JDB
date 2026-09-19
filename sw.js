/* JDB service worker.
 * Must live in the JDB root (same folder as index.html) so its scope is /JDB/.
 * Bump VERSION whenever PRECACHE_URLS changes or you want to force-refresh the shell.
 */
const VERSION = 'v1';
const SHELL_CACHE = `jdb-shell-${VERSION}`;   // precached app shell, replaced on each VERSION bump
const RUNTIME_CACHE = 'jdb-runtime';          // everything visited later (pages, data, images), trimmed by size
const MAX_RUNTIME_ENTRIES = 600;
const NAV_TIMEOUT_MS = 3000;

// Cross-origin hosts that are safe to cache. Everything else (GA, Cloudflare Worker
// proxies, ponosgames.com ...) is left alone and goes straight to the network.
const CDN_HOSTS = ['cdn.jsdelivr.net', 'fastly.jsdelivr.net', 'code.jquery.com'];

// Paths are resolved relative to sw.js.
const PRECACHE_URLS = [
  './',
  'offline.html',
  'manifest.webmanifest',
  'static/favicon.ico',
  'static/img/jdb.png',
  'static/css/database/style.css',
  'static/css/database/origin.css',
  'static/css/home/index_style_addition.css',
  'static/dark-mode-toggle/dark.css',
  'static/dark-mode-toggle/light.css',
  'static/dark-mode-toggle/common.css',
  'static/dark-mode-toggle/slider.css',
  'static/dark-mode-toggle/dark-mode-toggle.js',
  'static/js/home/lang.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // allSettled: one missing file must not abort the whole install.
    await Promise.allSettled(
      PRECACHE_URLS.map((u) => cache.add(new Request(u, { cache: 'reload' })))
    );
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith('jdb-shell-') && k !== SHELL_CACHE)
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// pwa.js sends this when the user taps "reload" on the update toast.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return; // Cache API can't store 206

  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  } else if (!CDN_HOSTS.includes(url.hostname)) {
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(event));
  } else {
    event.respondWith(staleWhileRevalidate(event));
  }
});

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
}

async function trim(cache) {
  const keys = await cache.keys(); // roughly oldest-first
  const extra = keys.length - MAX_RUNTIME_ENTRIES;
  if (extra > 0) await Promise.all(keys.slice(0, extra).map((k) => cache.delete(k)));
}

function store(event, cache, req, res) {
  if (res.ok || res.type === 'opaque') {
    const copy = res.clone();
    event.waitUntil(cache.put(req, copy).then(() => trim(cache)).catch(() => {}));
  }
}

// HTML pages: always try the network first so new deploys show up immediately;
// fall back to cache (ignoring ?cc=...&id=... since the HTML is the same template).
async function networkFirst(event) {
  const req = event.request;
  const cache = await caches.open(RUNTIME_CACHE);
  const network = fetch(req).then((res) => { store(event, cache, req, res); return res; });
  network.catch(() => {}); // avoid unhandled rejection if we already answered from cache

  const cached = await caches.match(req, { ignoreSearch: true });
  try {
    if (!cached) return await network;               // nothing to fall back on: wait for the network
    return await Promise.race([network, timeout(NAV_TIMEOUT_MS)]);
  } catch (err) {
    return cached || (await caches.match('offline.html')) || Response.error();
  }
}

// CSS / JS / images / JSON data: serve from cache instantly, refresh in the background.
async function staleWhileRevalidate(event) {
  const req = event.request;
  const cache = await caches.open(RUNTIME_CACHE);
  // Check the runtime cache first: it holds newer copies than the precached shell.
  const cached = (await cache.match(req)) || (await caches.match(req));

  const update = fetch(req)
    .then((res) => { store(event, cache, req, res); return res; })
    .catch(() => null);

  if (cached) {
    event.waitUntil(update);
    return cached;
  }
  return (await update) || Response.error();
}
