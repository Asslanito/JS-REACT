import { useEffect, useState } from 'react'
import useRoute from './hooks/useRoute.js'
import useFavorites from './hooks/useFavorites.js'
import Header from './components/Header.jsx'
import Explorer from './components/Explorer.jsx'
import PlaceDetail from './components/PlaceDetail.jsx'
import PlaceForm from './components/PlaceForm.jsx'
import Icon from './components/Icon.jsx'

export default function App() {
  const route = useRoute()
  const favorites = useFavorites()
  const [revision, setRevision] = useState(0)
  const [notice, setNotice] = useState('')
  const isExplorer = route === '/' || route === '/saved'
  const savedOnly = route === '/saved'
  const placeId = route.startsWith('/places/')
    ? route.slice('/places/'.length)
    : null

  useEffect(() => {
    if (!notice) return
    const timeout = setTimeout(() => setNotice(''), 6000)
    return () => clearTimeout(timeout)
  }, [notice])

  function created(place) {
    setRevision((value) => value + 1)
    setNotice(`${place.name} is on the atlas. Saved on this device.`)
    window.location.hash = `/places/${place.id}`
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header route={route} savedCount={favorites.ids.length} />
      <main id="main" className="main-container">
        {favorites.error && (
          <p className="storage-warning" role="alert">
            {favorites.error}
          </p>
        )}
        <div hidden={!isExplorer}>
          <Explorer
            savedOnly={savedOnly}
            favorites={favorites}
            revision={revision}
            onRefresh={() => setRevision((value) => value + 1)}
          />
        </div>
        {placeId && (
          <PlaceDetail
            key={placeId}
            id={placeId}
            favorites={favorites}
            revision={revision}
          />
        )}
        {route === '/add' && <PlaceForm onCreated={created} />}
        {!isExplorer && !placeId && route !== '/add' && (
          <section className="empty-state">
            <h1>This corner isn’t on the map.</h1>
            <p>Head back to discover your next study spot.</p>
            <a className="button primary" href="#/">
              Back to exploring
            </a>
          </section>
        )}
        <footer className="site-footer">
          <a className="footer-brand" href="#/">
            <Icon name="atlas" size={20} />
            study atlas.
          </a>
          <span>Find a place. Make a little progress.</span>
          <small>Demo locations · Additions stay on this device.</small>
        </footer>
      </main>
      {notice && (
        <div className="toast" role="status">
          <Icon name="check" size={18} />
          {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice('')}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </>
  )
}
