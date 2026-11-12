/* Offline-werking: eerst het netwerk proberen, anders de opgeslagen kopie. */
var CACHE = 'gebedstijden-v4';
var FILES = ['./', 'index.html', 'calc.js', 'i18n.js', 'app.js', 'icon.png', 'icon-512.png', 'manifest.webmanifest'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u = new URL(e.request.url);
  if (u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone();
    caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
    return r;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || caches.match('index.html'); });
  }));
});
