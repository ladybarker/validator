const PREFIX = '/ad-preview/';
const files = new Map();

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'LOAD_FILES') {
    files.clear();
    for (const [path, entry] of Object.entries(e.data.files)) {
      files.set(path, entry);
    }
  }
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (!url.pathname.startsWith(PREFIX)) return;

  const path = decodeURIComponent(url.pathname.slice(PREFIX.length));

  // Try exact match, then basename match
  const entry = files.get(path) || files.get(path.split('/').pop());
  if (!entry) return;

  e.respondWith(new Response(entry.bytes.buffer, {
    status: 200,
    headers: { 'Content-Type': entry.mime, 'Access-Control-Allow-Origin': '*' }
  }));
});
