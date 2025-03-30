const CACHE_NAME = "hair-salon-cache-v2"; // Cache version

const ASSETS = [
  "/",
  "/index.html",
  "/icons/logo-192x192.png",
  "/icons/logo-512x512.png",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets");
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Service Worker
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

// Fetch event - Serve from Cache First, then Network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Push Notification (Optional, Future Feature)
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