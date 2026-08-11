/* Zagalicos · service worker
   Estrategia:
   - App shell (HTML, iconos, manifest): network-first con fallback a caché.
     Así siempre coges la última versión si hay red, pero la app abre sin conexión.
   - API (workers.dev, biwenger, cdn): NUNCA se cachea aquí. Los datos deben ser frescos,
     y el histórico ya se guarda en localStorage dentro de la propia app.
*/
const CACHE = 'zagalicos-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Datos en vivo: dejar pasar sin tocar
  if (url.hostname.includes('workers.dev') ||
      url.hostname.includes('biwenger') ||
      url.hostname.includes('cdn-cgi')) {
    return;
  }

  // Solo gestionamos lo que es de nuestro propio origen
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
