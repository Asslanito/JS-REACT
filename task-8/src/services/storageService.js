// The only place that touches localStorage (UI components never do).
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: ignore */
  }
}

export const themeStorage = {
  get: () => read('shopdesk:theme', null),
  set: (t) => write('shopdesk:theme', t),
};

export const favoritesStorage = {
  get: (uid) => read(`shopdesk:favorites:${uid}`, []),
  set: (uid, ids) => write(`shopdesk:favorites:${uid}`, ids),
};
