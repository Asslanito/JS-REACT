import { useState } from 'react'

const key = 'study-atlas:favorites:v1'

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? '[]')
    if (!Array.isArray(stored) || !stored.every((id) => typeof id === 'string'))
      throw new Error('Invalid saved places')
    return { ids: [...new Set(stored)], error: '' }
  } catch {
    return {
      ids: [],
      error:
        'Your saved list could not be read. Saving a place will start a new list.',
    }
  }
}

export default function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites)
  function toggle(id) {
    const ids = favorites.ids.includes(id)
      ? favorites.ids.filter((item) => item !== id)
      : [...favorites.ids, id]
    try {
      localStorage.setItem(key, JSON.stringify(ids))
      setFavorites({ ids, error: '' })
    } catch {
      setFavorites((previous) => ({
        ...previous,
        error: 'Could not save your list. Allow browser storage and try again.',
      }))
    }
  }
  return { ...favorites, toggle }
}
