/* Service Worker – macht die App offline nutzbar. Version bei jeder Änderung erhöhen. */
const CACHE = "judo-kyu-v1";
const DATEIEN = [
  "./", "index.html", "style.css", "data.js", "logik.js", "fehler.js", "app.js", "manifest.json",
  "icon-180.png", "icon-192.png", "icon-512.png",
  "fonts/barlow-latin-400-normal.woff2", "fonts/barlow-latin-600-normal.woff2",
  "fonts/barlow-condensed-latin-600-normal.woff2", "fonts/barlow-condensed-latin-700-normal.woff2",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(treffer => treffer || fetch(e.request).catch(() =>
      // Bei Navigations-Anfragen offline auf die App-Startseite zurückfallen
      e.request.mode === "navigate" ? caches.match("index.html") : undefined
    ))
  );
});
