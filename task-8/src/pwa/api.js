// Use for PUBLIC API calls. Never route auth/private requests through here.
export async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(res.headers.get('x-sw-cache') === 'miss' ? 'offline' : `HTTP ${res.status}`);
  return { data: await res.json(), fromCache: res.headers.get('x-sw-cache') === 'hit' };
}
