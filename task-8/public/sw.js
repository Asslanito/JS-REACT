
const VERSION = 'v1';
const SHELL = `shell-${VERSION}`, STATIC = `static-${VERSION}`, API = `api-${VERSION}`, PAGES = `pages-${VERSION}`;
const CURRENT = [SHELL, STATIC, API, PAGES];
const MAX_ENTRIES = { [STATIC]: 80, [API]: 50, [PAGES]: 30 };
const API_MAX_AGE = 7 * 24 * 3600 * 1000;       // 7 days
const NETWORK_TIMEOUT = 5000;
const PRIVATE_RE = /\/(auth|login|logout|register|signin|signup|token|refresh|me|profile|account|user|users\/me|session)(\/|\?|$)/i;
const SHELL_URLS = ['/offline.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];


self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    const res = await fetch('/index.html', { cache: 'reload' });
    const html = await res.clone().text();
    await cache.put('/index.html', res.clone());
    await cache.put('/', res);
    const built = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map((m) => new URL(m[1], self.location.origin))
      .filter((u) => u.origin === self.location.origin && /\.(js|css|svg|png|ico|woff2?)$/.test(u.pathname))
      .map((u) => u.pathname);
    await Promise.all([...new Set([...SHELL_URLS, ...built])].map((u) => cache.add(u).catch(() => {})));

  })());
});


self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => !CURRENT.includes(n)).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });

async function trim(name) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  const max = MAX_ENTRIES[name];
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}
function stamp(res, extra = {}) {
  const h = new Headers(res.headers);
  Object.entries(extra).forEach(([k, v]) => h.set(k, v));
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.ok || res.type === 'opaque') {
      const cache = await caches.open(STATIC);
      cache.put(req, res.clone()).then(() => trim(STATIC));
    }
    return res;
  } catch {
    return Response.error();
  }
}


async function networkFirst(req) {
  const cache = await caches.open(API);
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), NETWORK_TIMEOUT);
    const res = await fetch(req, { signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok && res.type !== 'opaque') {
      await cache.put(req, stamp(res.clone(), { 'x-sw-fetched-at': String(Date.now()) }));
      trim(API);
    }
    return res;
  } catch {
    const hit = await cache.match(req);
    if (hit) {
      const at = Number(hit.headers.get('x-sw-fetched-at') || 0);
      if (Date.now() - at < API_MAX_AGE) return stamp(hit, { 'x-sw-cache': 'hit' });
      await cache.delete(req);
    }
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503, headers: { 'Content-Type': 'application/json', 'x-sw-cache': 'miss' },
    });
  }
}


async function navigate(req) {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(PAGES);
      cache.put(req, res.clone()).then(() => trim(PAGES));
    }
    return res;
  } catch {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (new URL(req.url).pathname === '/offline') return (await caches.match('/index.html')) || caches.match('/offline.html');
    return caches.match('/offline.html');
  }
}


self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!url.protocol.startsWith('http')) return;
  const SKIP_HOSTS = ['firestore.googleapis.com', 'identitytoolkit.googleapis.com', 'securetoken.googleapis.com', 'firebaseio.com', 'firebasestorage.googleapis.com'];
  if (SKIP_HOSTS.some((h) => url.hostname.endsWith(h))) return;
  if (req.mode === 'navigate') return event.respondWith(navigate(req));
  if (['image', 'font', 'style', 'script'].includes(req.destination)) return event.respondWith(cacheFirst(req));
  if (req.headers.has('authorization') || PRIVATE_RE.test(url.pathname)) return;
  if (req.destination === '') return event.respondWith(networkFirst(req));
});
