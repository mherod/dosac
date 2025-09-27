/**
 * Service Worker for DOSAC.UK - The Thick of It Memes
 * Provides offline functionality and caching for better performance
 */

const STATIC_CACHE_NAME = "dosac-static-v1.0.0";
const DYNAMIC_CACHE_NAME = "dosac-dynamic-v1.0.0";

// Static assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/pwa-icon-192x192.png",
  "/pwa-icon-512x512.png",
];

// API routes to cache
const API_ROUTES = ["/api/frames/", "/api/moments/"];

// Image patterns to cache
const IMAGE_PATTERNS = [
  /\/frames\/.*\.(webp|jpg|jpeg|png)$/,
  /\/characters\/.*\.(webp|jpg|jpeg|png)$/,
  /\/og-.*\.(webp|jpg|jpeg|png)$/,
];

/**
 * Install event - cache static assets
 */
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        console.log("Service Worker: Caching static assets");
        await cache.addAll(STATIC_ASSETS);
        console.log("Service Worker: Installation complete");
        await self.skipWaiting();
      } catch (error) {
        console.error("Service Worker: Installation failed", error);
      }
    })(),
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
        console.log("Service Worker: Activation complete");
        await self.clients.claim();
      } catch (error) {
        console.error("Service Worker: Activation failed", error);
      }
    })(),
  );
});

/**
 * Fetch event - serve from cache or network
 */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
  } else {
    event.respondWith(handleOtherRequest(request));
  }
});

/**
 * Check if request is for a static asset
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    STATIC_ASSETS.includes(url.pathname) ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image")
  );
}

/**
 * Check if request is for an image
 */
function isImageRequest(request) {
  const url = new URL(request.url);
  return (
    IMAGE_PATTERNS.some((pattern) => pattern.test(url.pathname)) ||
    request.destination === "image"
  );
}

/**
 * Check if request is for an API endpoint
 */
function isAPIRequest(request) {
  const url = new URL(request.url);
  return API_ROUTES.some((route) => url.pathname.startsWith(route));
}

/**
 * Check if request is for a page
 */
function isPageRequest(request) {
  const url = new URL(request.url);
  return (
    request.destination === "document" && url.origin === self.location.origin
  );
}

/**
 * Handle static asset requests
 */
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("Service Worker: Static asset fetch failed", error);
    return new Response("Offline", { status: 503 });
  }
}

/**
 * Handle image requests
 */
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("Service Worker: Image fetch failed", error);
    // Return a placeholder image or fallback
    return new Response("Image not available offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

/**
 * Handle API requests
 */
async function handleAPIRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    // For API requests, try network first, then cache
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (networkError) {
      // If network fails, try cache
      if (cachedResponse) {
        return cachedResponse;
      }
      throw networkError;
    }
  } catch (error) {
    console.error("Service Worker: API fetch failed", error);
    return new Response(
      JSON.stringify({
        error: "Service unavailable offline",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

/**
 * Handle page requests
 */
async function handlePageRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (_networkError) {
      // If network fails, try cache
      if (cachedResponse) {
        return cachedResponse;
      }

      // If no cache, return offline page
      return new Response(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - DOSAC.UK</title>
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 2rem; 
              background: #f3f2f1;
            }
            .offline-container {
              max-width: 400px;
              margin: 0 auto;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #1e40af; margin-bottom: 1rem; }
            p { color: #666; margin-bottom: 1.5rem; }
            .retry-btn {
              background: #1e40af;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 4px;
              cursor: pointer;
              font-size: 1rem;
            }
            .retry-btn:hover { background: #1d4ed8; }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <h1>You're Offline</h1>
            <p>It looks like you're not connected to the internet. Some content may not be available.</p>
            <button class="retry-btn" onclick="window.location.reload()">
              Try Again
            </button>
          </div>
        </body>
        </html>
      `,
        {
          status: 200,
          headers: { "Content-Type": "text/html" },
        },
      );
    }
  } catch (error) {
    console.error("Service Worker: Page fetch failed", error);
    return new Response("Offline", { status: 503 });
  }
}

/**
 * Handle other requests
 */
async function handleOtherRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error("Service Worker: Request failed", error);
    return new Response("Offline", { status: 503 });
  }
}

/**
 * Handle background sync
 */
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Perform background sync
 */
async function doBackgroundSync() {
  try {
    // Perform any background tasks here
    console.log("Service Worker: Performing background sync");
  } catch (error) {
    console.error("Service Worker: Background sync failed", error);
  }
}

/**
 * Handle push notifications
 */
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received");

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || "New update available",
      icon: "/pwa-icon-192x192.png",
      badge: "/favicon-32x32.png",
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: [
        {
          action: "open",
          title: "Open App",
          icon: "/pwa-icon-192x192.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/favicon-32x32.png",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "DOSAC.UK", options),
    );
  }
});

/**
 * Handle notification clicks
 */
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event.action);

  event.notification.close();

  if (event.action === "open" || !event.action) {
    event.waitUntil(clients.openWindow("/"));
  }
});
