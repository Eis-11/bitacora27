/* Service worker de Bitácora'27: permite instalar la app y usarla sin internet.
 * Archivos propios: primero red (para ver vacantes y cambios nuevos), si no hay red usa la copia guardada.
 * Tailwind y fuentes: usa la copia guardada y la actualiza en segundo plano.
 * Cambia VERSION cuando publiques cambios grandes para limpiar la caché vieja. */
const VERSION = "b27-v2";
const CORE = [
  "./", "./index.html", "./manifest.webmanifest",
  "./css/app.css",
  "./js/ui.js", "./js/midia.js", "./js/extras.js", "./js/focus.js", "./js/control.js", "./js/pwa.js",
  "./js/respaldo.js", "./js/crm.js", "./js/resid.js", "./js/cards.js", "./js/buscar.js", "./data/tarjetas.js",
  "./data/vacantes.js", "./data/ruta.js", "./data/certs.js", "./data/plan_diario.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/favicon-32.png"
];
const CDN = [
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Geist:wght@300..800&family=Geist+Mono:wght@400..600&family=Instrument+Serif:ital@0;1&display=swap"
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(CORE);
    await Promise.all(CDN.map(async (u) => { try { await c.put(u, await fetch(u, { mode: "no-cors" })); } catch { /* sin red: se guarda después */ } }));
  })());
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const cdn = /(^|\.)(tailwindcss\.com|googleapis\.com|gstatic\.com)$/.test(url.hostname);
  if (!sameOrigin && !cdn) return;

  if (sameOrigin) {
    // Red primero; si falla, caché (ignorando ?query y #hash).
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      try {
        const res = await fetch(req, { cache: "no-cache" });
        if (res.ok) c.put(req, res.clone());
        return res;
      } catch {
        return (await c.match(req, { ignoreSearch: true })) ||
          (req.mode === "navigate" ? await c.match("./index.html") : Response.error());
      }
    })());
    return;
  }

  // CDN y fuentes: caché primero y actualiza en segundo plano.
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    const hit = await c.match(req);
    const net = fetch(req).then((res) => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});
