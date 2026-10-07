import { pageSize } from './constants.js'

export function queryPlaces(places, query, favoriteIds = []) {
  const search = (query.search ?? '').trim().toLocaleLowerCase()
  const filtered = places.filter((place) => {
    const haystack =
      `${place.name} ${place.city} ${place.district} ${place.category} ${place.description}`.toLocaleLowerCase()
    return (
      (!search || haystack.includes(search)) &&
      (!query.category ||
        query.category === 'All spots' ||
        place.category === query.category) &&
      (!query.city ||
        query.city === 'All cities' ||
        place.city === query.city) &&
      (!query.noise ||
        query.noise === 'Any atmosphere' ||
        place.noise === query.noise) &&
      (!query.freeOnly || place.price === 0) &&
      (!query.wifiOnly || place.wifi) &&
      (!query.savedOnly || favoriteIds.includes(place.id))
    )
  })
  filtered.sort((a, b) => {
    if (query.sort === 'name')
      return a.name.localeCompare(b.name) || a.id.localeCompare(b.id)
    if (query.sort === 'price')
      return (
        a.price - b.price || b.rating - a.rating || a.id.localeCompare(b.id)
      )
    if (query.sort === 'newest')
      return b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id)
    return (
      b.rating - a.rating ||
      a.name.localeCompare(b.name) ||
      a.id.localeCompare(b.id)
    )
  })
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, Number(query.page) || 1), pages)
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total,
    pages,
    page,
  }
}
