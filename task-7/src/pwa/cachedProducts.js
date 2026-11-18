
export async function getCachedProducts() {
  if (!('caches' in window)) return { products: [], updatedAt: null };
  const map = new Map();
  let updatedAt = 0;
  const names = (await caches.keys()).filter((n) => n.startsWith('api-'));
  for (const name of names) {
    const cache = await caches.open(name);
    for (const req of await cache.keys()) {
      if (!req.url.includes('/products')) continue;
      const res = await cache.match(req);
      if (!res) continue;
      try {
        const json = await res.clone().json();
        (json.products || []).forEach((p) => map.set(p.id, p));
        if (json.id && json.title) map.set(json.id, json); // single product details
        const t = Number(res.headers.get('x-sw-fetched-at') || 0);
        if (t > updatedAt) updatedAt = t;
      } catch { /* not JSON, skip */ }
    }
  }
  return { products: [...map.values()], updatedAt: updatedAt || null };
}