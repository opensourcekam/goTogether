/*
 * goTogether service worker (hand-rolled).
 *
 * Strategy:
 *  - Precache a minimal offline app shell on install.
 *  - Navigation requests: network-first, falling back to the cached shell
 *    (`/offline`) when the network is unavailable.
 *  - Static assets (same-origin GET): stale-while-revalidate.
 *
 * Later phases (map tiles, POI data) can extend the runtime caching rules
 * below without changing the registration in `ServiceWorkerRegister.tsx`.
 */

const VERSION = "v1";
const SHELL_CACHE = `gotogether-shell-${VERSION}`;
const RUNTIME_CACHE = `gotogether-runtime-${VERSION}`;

const OFFLINE_URL = "/offline";
const SHELL_ASSETS = [OFFLINE_URL, "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const network = await fetch(request);
          return network;
        } catch {
          const cache = await caches.open(SHELL_CACHE);
          const cached = await cache.match(OFFLINE_URL);
          return (
            cached ??
            new Response("Offline", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            })
          );
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);
      return cached ?? network;
    })()
  );
});
