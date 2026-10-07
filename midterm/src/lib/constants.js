export const categories = ['Library', 'Café', 'Coworking', 'Campus room']
export const cities = ['Almaty', 'Astana', 'Qyzylorda']
export const noiseLevels = ['Quiet', 'Moderate', 'Lively']
export const pageSize = 9
export const initialFilters = {
  search: '',
  category: 'All spots',
  city: 'All cities',
  noise: 'Any atmosphere',
  freeOnly: false,
  wifiOnly: false,
  sort: 'recommended',
  page: 1,
}

export function formatPrice(price) {
  return price === 0
    ? 'Free entry'
    : `${price.toLocaleString('en-US')} ₸ / visit`
}
