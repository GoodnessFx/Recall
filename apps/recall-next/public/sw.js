self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
// Simple offline fallback for root
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === 'GET' && url.pathname === '/') {
    event.respondWith(fetch(event.request).catch(() => new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } })));
  }
});

