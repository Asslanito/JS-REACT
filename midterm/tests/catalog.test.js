import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import seed from '../src/data/places.json' with { type: 'json' }
import { initialFilters } from '../src/lib/constants.js'
import { queryPlaces } from '../src/lib/query.js'
import {
  placesApi,
  placesStorageKey,
  validatePlace,
  waitForResponse,
} from '../src/lib/api.js'

const originalStorage = globalThis.localStorage
let storage
beforeEach(() => {
  storage = new Map()
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  }
})
afterEach(() => {
  globalThis.localStorage = originalStorage
})

test('the seed has 120 valid records with unique stable identifiers', () => {
  assert.equal(seed.length, 120)
  assert.equal(new Set(seed.map((place) => place.id)).size, 120)
  for (const place of seed) assert.deepEqual(validatePlace(place), {})
})

test('search, category, city, noise, free entry, and Wi-Fi combine correctly', () => {
  const query = {
    ...initialFilters,
    search: 'The Reading Room',
    city: 'Almaty',
    category: 'Library',
    noise: 'Quiet',
    freeOnly: true,
    wifiOnly: true,
  }
  const result = queryPlaces(seed, query)
  assert.equal(result.total, 1)
  assert.equal(result.items[0].id, 'spot-001')
  assert.equal(
    queryPlaces(seed, { ...query, search: 'no-such-place' }).total,
    0,
  )
})

test('every catalog page contains distinct records and respects its boundaries', () => {
  const ids = []
  for (let page = 1; page <= 14; page++) {
    const result = queryPlaces(seed, { ...initialFilters, page })
    assert.equal(result.pages, 14)
    assert.ok(result.items.length <= 9)
    ids.push(...result.items.map((place) => place.id))
  }
  assert.equal(ids.length, 120)
  assert.equal(new Set(ids).size, 120)
  assert.equal(queryPlaces(seed, { ...initialFilters, page: 999 }).page, 14)
})

test('sorts by price, name, rating, and creation date without mutating source data', () => {
  const originalIds = seed.map((place) => place.id)
  for (const [sort, compare] of [
    ['price', (a, b) => a.price <= b.price],
    ['name', (a, b) => a.name.localeCompare(b.name) <= 0],
    ['recommended', (a, b) => a.rating >= b.rating],
    ['newest', (a, b) => a.createdAt >= b.createdAt],
  ]) {
    const { items } = queryPlaces(seed, { ...initialFilters, sort })
    for (let index = 1; index < items.length; index++)
      assert.ok(compare(items[index - 1], items[index]))
  }
  assert.deepEqual(
    seed.map((place) => place.id),
    originalIds,
  )
})

test('saved-only filtering handles a shrinking collection and an empty collection', () => {
  const result = queryPlaces(
    seed,
    { ...initialFilters, savedOnly: true, page: 3 },
    ['spot-001', 'spot-014'],
  )
  assert.equal(result.total, 2)
  assert.equal(result.page, 1)
  assert.equal(
    queryPlaces(seed, { ...initialFilters, savedOnly: true }, []).total,
    0,
  )
})

test('invalid form values are rejected and cannot enter the catalog', async () => {
  const invalid = {
    ...seed[0],
    name: 'a',
    description: 'short',
    price: '-1',
    seats: '1.5',
    closes: '08:00',
  }
  assert.deepEqual(Object.keys(validatePlace(invalid)).sort(), [
    'closes',
    'description',
    'name',
    'price',
    'seats',
  ])
  await assert.rejects(
    placesApi.create(invalid),
    /Check the highlighted fields/,
  )
  assert.equal(storage.size, 0)
})

test('a new place persists, is available in detail view, and starts without a rating', async () => {
  const place = await placesApi.create({
    ...seed[0],
    name: '  Test Reading Room  ',
    price: '0',
    seats: '30',
  })
  assert.equal(place.name, 'Test Reading Room')
  assert.equal(place.seats, 30)
  assert.equal(place.rating, 0)
  assert.notEqual(place.id, seed[0].id)
  assert.equal(JSON.parse(storage.get(placesStorageKey)).length, 121)
  assert.equal((await placesApi.get(place.id)).name, 'Test Reading Room')
  const result = await placesApi.list(
    { ...initialFilters, search: 'test reading' },
    [],
  )
  assert.equal(result.total, 1)
})

test('cancelled requests reject with AbortError, including before a request begins', async () => {
  const controller = new AbortController()
  const response = waitForResponse(controller.signal, 1000)
  controller.abort()
  await assert.rejects(response, { name: 'AbortError' })
  await assert.rejects(placesApi.list(initialFilters, [], controller.signal), {
    name: 'AbortError',
  })
})

test('cancelled mutations never write to storage', async () => {
  const controller = new AbortController()
  const response = placesApi.create(seed[0], controller.signal)
  controller.abort()
  await assert.rejects(response, { name: 'AbortError' })
  assert.equal(storage.size, 0)
})

test('corrupt persisted data produces a recoverable error and restore reseeds the catalog', async () => {
  storage.set(placesStorageKey, '{broken')
  await assert.rejects(placesApi.list(initialFilters, []), /could not be read/)
  await placesApi.restore()
  assert.equal((await placesApi.list(initialFilters, [])).total, 120)
})

test('storage failures and unknown detail identifiers are reported', async () => {
  await assert.rejects(placesApi.get('missing'), /could not be found/)
  globalThis.localStorage.getItem = () => {
    throw new Error('blocked')
  }
  await assert.rejects(
    placesApi.list(initialFilters, []),
    /storage is unavailable/,
  )
})

test('storage quota failure does not report a successful creation', async () => {
  globalThis.localStorage.setItem = () => {
    throw new Error('full')
  }
  await assert.rejects(placesApi.create(seed[0]), /could not be saved/)
})
