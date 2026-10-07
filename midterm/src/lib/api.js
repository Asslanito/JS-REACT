import seed from '../data/places.json' with { type: 'json' }
import { categories, cities, noiseLevels } from './constants.js'
import { queryPlaces } from './query.js'

export const placesStorageKey = 'study-atlas:places:v1'

export function waitForResponse(signal, milliseconds = 350) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Request cancelled.', 'AbortError'))
      return
    }
    const timeout = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve()
    }, milliseconds)
    function abort() {
      clearTimeout(timeout)
      signal.removeEventListener('abort', abort)
      reject(new DOMException('Request cancelled.', 'AbortError'))
    }
    signal?.addEventListener('abort', abort, { once: true })
  })
}

export function validatePlace(values) {
  const errors = {}
  if (
    !values.name ||
    values.name.trim().length < 3 ||
    values.name.trim().length > 80
  )
    errors.name = 'Use a name between 3 and 80 characters.'
  if (!categories.includes(values.category))
    errors.category = 'Choose a type of place.'
  if (!cities.includes(values.city)) errors.city = 'Choose a city.'
  if (
    !values.district ||
    values.district.trim().length < 2 ||
    values.district.trim().length > 60
  )
    errors.district = 'Use a district between 2 and 60 characters.'
  if (
    !values.address ||
    values.address.trim().length < 5 ||
    values.address.trim().length > 120
  )
    errors.address = 'Use an address between 5 and 120 characters.'
  if (!noiseLevels.includes(values.noise))
    errors.noise = 'Choose an atmosphere.'
  if (
    values.price === '' ||
    !Number.isFinite(Number(values.price)) ||
    Number(values.price) < 0 ||
    Number(values.price) > 50000
  )
    errors.price = 'Enter a price from 0 to 50,000 ₸.'
  if (
    !Number.isInteger(Number(values.seats)) ||
    Number(values.seats) < 1 ||
    Number(values.seats) > 500
  )
    errors.seats = 'Enter a whole number from 1 to 500.'
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.opens ?? ''))
    errors.opens = 'Choose an opening time.'
  if (
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.closes ?? '') ||
    values.closes <= values.opens
  )
    errors.closes = 'Closing time must be after opening time.'
  if (
    !values.description ||
    values.description.trim().length < 20 ||
    values.description.trim().length > 600
  )
    errors.description = 'Describe the place in 20–600 characters.'
  return errors
}

function readPlaces() {
  let stored
  try {
    stored = localStorage.getItem(placesStorageKey)
  } catch {
    throw new Error(
      'Browser storage is unavailable. Allow site storage and try again.',
    )
  }
  if (stored === null) return seed
  try {
    const places = JSON.parse(stored)
    if (
      !Array.isArray(places) ||
      !places.every(
        (place) =>
          typeof place.id === 'string' &&
          typeof place.createdAt === 'string' &&
          Number.isFinite(place.rating) &&
          typeof place.wifi === 'boolean' &&
          typeof place.outlets === 'boolean' &&
          Object.keys(validatePlace(place)).length === 0,
      ) ||
      new Set(places.map((place) => place.id)).size !== places.length
    )
      throw new Error('Invalid records')
    return places
  } catch {
    throw new Error(
      'Saved place data could not be read. Restore the demo catalog to continue.',
    )
  }
}

export const placesApi = {
  async list(query, favoriteIds, signal) {
    await waitForResponse(signal)
    const places = readPlaces()
    return {
      ...queryPlaces(places, query, favoriteIds),
      catalogTotal: places.length,
    }
  },
  async get(id, signal) {
    await waitForResponse(signal)
    const place = readPlaces().find((item) => item.id === id)
    if (!place)
      throw new Error(
        'This place could not be found. It may have been removed from this device.',
      )
    return place
  },
  async create(values, signal) {
    const errors = validatePlace(values)
    if (Object.keys(errors).length)
      throw new Error('Check the highlighted fields and try again.')
    await waitForResponse(signal, 500)
    const places = readPlaces()
    const place = {
      ...values,
      name: values.name.trim(),
      district: values.district.trim(),
      address: values.address.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      seats: Number(values.seats),
      id: crypto.randomUUID(),
      rating: 0,
      createdAt: new Date().toISOString(),
    }
    try {
      localStorage.setItem(placesStorageKey, JSON.stringify([place, ...places]))
    } catch {
      throw new Error(
        'The place could not be saved. Browser storage may be full or disabled.',
      )
    }
    return place
  },
  async restore(signal) {
    await waitForResponse(signal)
    try {
      localStorage.removeItem(placesStorageKey)
    } catch {
      throw new Error(
        'Browser storage is unavailable. Allow site storage and try again.',
      )
    }
  },
}
