const BASE = 'https://dummyjson.com';
export const PAGE_SIZE = 12;

async function request(path, { signal, method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const cacheState = res.headers.get('x-sw-cache'); // ставит Service Worker: 'hit' | 'miss'
  if (cacheState === 'miss') throw new Error('You are offline and this data has not been cached yet.');
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const json = await res.json();
  // Помечаем ответ, пришедший из кэша (для плашки "Viewing cached data")
  if (method === 'GET' && json && !Array.isArray(json)) {
    return { ...json, fromCache: cacheState === 'hit' };
  }
  return json;
}

export const productKeys = {
  all: ['products'],
  list: (params) => ['products', 'list', params],
  categories: ['products', 'categories'],
};

export const productsApi = {
  list({ q = '', category = '', page = 1, signal }) {
    const skip = (page - 1) * PAGE_SIZE;
    const paging = `limit=${PAGE_SIZE}&skip=${skip}`;
    if (q) return request(`/products/search?q=${encodeURIComponent(q)}&${paging}`, { signal });
    if (category) return request(`/products/category/${encodeURIComponent(category)}?${paging}`, { signal });
    return request(`/products?${paging}`, { signal });
  },
  categories: (signal) => request('/products/categories', { signal }),
  create: (data) => request('/products/add', { method: 'POST', body: data }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),
  remove: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};