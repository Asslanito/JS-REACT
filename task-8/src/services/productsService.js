const BASE = 'https://dummyjson.com';
export const PAGE_SIZE = 12;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fail(message, noRetry) {
  const error = new Error(message);
  error.noRetry = noRetry;
  return error;
}

async function send(path, { signal, method, body }) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw fail('Network error. Check your connection.', false);
  }
  const cacheState = res.headers.get('x-sw-cache');
  if (cacheState === 'miss') throw fail('You are offline and this data has not been cached yet.', true);
  if (!res.ok) throw fail(`Request failed (${res.status})`, res.status < 500);
  const json = await res.json();
  if (method === 'GET' && json && !Array.isArray(json)) return { ...json, fromCache: cacheState === 'hit' };
  return json;
}

async function request(path, { signal, method = 'GET', body } = {}) {
  const retries = method === 'GET' ? 1 : 0;
  let attempt = 0;
  for (;;) {
    try {
      return await send(path, { signal, method, body });
    } catch (err) {
      if (err.name === 'AbortError' || err.noRetry || attempt >= retries) throw err;
      attempt += 1;
      await wait(400 * attempt);
    }
  }
}

const sortQuery = (sortBy, order) => (sortBy ? `&sortBy=${sortBy}&order=${order || 'asc'}` : '');

export const productsApi = {
  list({ q = '', category = '', page = 1, sortBy, order, signal } = {}) {
    const paging = `limit=${PAGE_SIZE}&skip=${(page - 1) * PAGE_SIZE}${sortQuery(sortBy, order)}`;
    if (q) return request(`/products/search?q=${encodeURIComponent(q)}&${paging}`, { signal });
    if (category) return request(`/products/category/${encodeURIComponent(category)}?${paging}`, { signal });
    return request(`/products?${paging}`, { signal });
  },
  get: (id, signal) => request(`/products/${encodeURIComponent(id)}`, { signal }),
  categories: (signal) => request('/products/categories', { signal }),
  create: (data) => request('/products/add', { method: 'POST', body: data }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),
  remove: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};
