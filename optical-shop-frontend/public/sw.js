const CACHE_NAME = "svo-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/icons/logo-192x192.png",
  "/icons/logo-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  console.log("Push Event Received:", event);
  event.waitUntil(
    self.registration.showNotification("Hair Salon", {
      body: "New Updates Available!",
      icon: "/icons/logo-192x192.png",
      badge: "/icons/logo-192x192.png",
    })
  );
});



