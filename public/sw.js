/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
// Service Worker for offline support and caching
const CACHE_NAME = "thickofitquotes-v1";
const urlsToCache = [
  "/",
  "/offline",
  "/favicon.ico",
  "/logo.svg",
  "/manifest.json",
];

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    }),
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Network first for API routes
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        }),
    );
    return;
  }

  // Cache first for static assets
  if (
    url.pathname.startsWith("/frames/") ||
    url.pathname.match(/\.(webp|png|jpg|jpeg|svg|woff2|woff|ttf|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      }),
    );
    return;
  }

  // Network first, fallback to cache for HTML
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // If no cache match and it's a navigation request, return offline page
          if (request.mode === "navigate") {
            return caches.match("/offline");
          }
          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
      }),
  );
});
