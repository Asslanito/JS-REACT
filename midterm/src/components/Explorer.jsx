import { useCallback, useState } from 'react'
import useAsync from '../hooks/useAsync.js'
import { placesApi } from '../lib/api.js'
import { initialFilters, pageSize } from '../lib/constants.js'
import Hero from './Hero.jsx'
import FilterBar from './FilterBar.jsx'
import PlaceCard from './PlaceCard.jsx'
import Pagination from './Pagination.jsx'
import AsyncState from './AsyncState.jsx'
import Icon from './Icon.jsx'

export default function Explorer({
  savedOnly,
  favorites,
  revision,
  onRefresh,
}) {
  const [filters, setFilters] = useState(initialFilters)
  const [retry, setRetry] = useState(0)
  const [restoreState, setRestoreState] = useState({
    status: 'idle',
    error: '',
  })
  const [restoreConfirmed, setRestoreConfirmed] = useState(false)
  const request = useCallback(
    (signal) =>
      placesApi.list({ ...filters, savedOnly }, favorites.ids, signal),
    [filters, savedOnly, favorites.ids],
  )
  const result = useAsync(request, [
    filters,
    savedOnly,
    favorites.ids,
    retry,
    revision,
  ])
  function changeFilter(field, value) {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
      page: field === 'page' ? value : 1,
    }))
  }
  function reset() {
    setFilters(initialFilters)
  }
  async function restore() {
    setRestoreState({ status: 'loading', error: '' })
    try {
      await placesApi.restore()
      setRestoreState({ status: 'success', error: '' })
      setRestoreConfirmed(false)
      onRefresh()
    } catch (error) {
      setRestoreState({ status: 'error', error: error.message })
    }
  }
  return (
    <>
      {savedOnly ? (
        <section className="saved-intro">
          <p className="eyebrow">KEEP THE GOOD ONES CLOSE</p>
          <h1>
            Your little list of <em>good places.</em>
          </h1>
          <p>All your saved spots, ready for your next study session.</p>
        </section>
      ) : (
        <Hero />
      )}
      <section className="catalog" aria-labelledby="catalog-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {savedOnly ? 'YOUR COLLECTION' : 'FIND YOUR FOCUS'}
            </p>
            <h2 id="catalog-heading">
              {savedOnly ? 'Saved spots' : 'Explore the spots'}
              <span className="heading-dot">.</span>
            </h2>
          </div>
          <span className="catalog-caption">
            <Icon name="atlas" size={16} />A space for every kind of mind.
          </span>
        </div>
        <FilterBar filters={filters} onChange={changeFilter} onReset={reset} />
        {result.status === 'success' ? (
          <>
            <div className="results-heading">
              <p role="status">
                {result.data.total ? (
                  <>
                    Showing{' '}
                    <strong>
                      {(result.data.page - 1) * pageSize + 1}–
                      {Math.min(result.data.page * pageSize, result.data.total)}
                    </strong>{' '}
                    of <strong>{result.data.total}</strong> spots
                  </>
                ) : (
                  'No spots in this view'
                )}
              </p>
              <span>
                <span className="live-dot" />
                {result.data.catalogTotal} spots in the demo catalog
              </span>
            </div>
            {result.data.items.length ? (
              <>
                <div className="place-grid">
                  {result.data.items.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      saved={favorites.ids.includes(place.id)}
                      onToggle={favorites.toggle}
                    />
                  ))}
                </div>
                <Pagination
                  page={result.data.page}
                  pages={result.data.pages}
                  total={result.data.total}
                  onChange={(page) => changeFilter('page', page)}
                />
              </>
            ) : (
              <AsyncState
                emptyTitle={
                  savedOnly
                    ? 'Your next favorite is waiting.'
                    : 'No places match just yet.'
                }
                emptyCopy={
                  savedOnly
                    ? 'Save a spot with the heart button, or reset your filters to see more of your collection.'
                    : 'Try another neighborhood, a different city, or fewer filters.'
                }
                onReset={reset}
              >
                {savedOnly && (
                  <a className="button" href="#/">
                    Explore the spots
                    <Icon name="arrow" size={16} />
                  </a>
                )}
              </AsyncState>
            )}
          </>
        ) : (
          <AsyncState
            status={result.status}
            error={result.error}
            onRetry={() => setRetry((value) => value + 1)}
          >
            {!restoreConfirmed ? (
              <button
                className="button"
                onClick={() => setRestoreConfirmed(true)}
              >
                Restore demo catalog
              </button>
            ) : (
              <div className="restore-confirm">
                <p>
                  Restore the 120 demo spots? Places added on this device will
                  be removed. Your saved list stays.
                </p>
                <button
                  className="button"
                  onClick={() => setRestoreConfirmed(false)}
                  disabled={restoreState.status === 'loading'}
                >
                  Cancel
                </button>
                <button
                  className="button primary"
                  onClick={restore}
                  disabled={restoreState.status === 'loading'}
                >
                  {restoreState.status === 'loading'
                    ? 'Restoring…'
                    : 'Confirm restore'}
                </button>
                {restoreState.error && <p role="alert">{restoreState.error}</p>}
              </div>
            )}
          </AsyncState>
        )}
      </section>
      <aside className="contribute-banner">
        <span className="contribute-icon">
          <Icon name="coffee" size={30} />
        </span>
        <div>
          <h2>Know a good corner?</h2>
          <p>Your favorite study spot could be someone’s next discovery.</p>
        </div>
        <a className="button" href="#/add">
          Add a spot
          <Icon name="plus" size={17} />
        </a>
      </aside>
    </>
  )
}
