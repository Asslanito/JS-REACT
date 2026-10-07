import { useCallback, useState } from 'react'
import useAsync from '../hooks/useAsync.js'
import { placesApi } from '../lib/api.js'
import { formatPrice } from '../lib/constants.js'
import AsyncState from './AsyncState.jsx'
import SpaceArt from './SpaceArt.jsx'
import Icon from './Icon.jsx'

export default function PlaceDetail({ id, favorites, revision }) {
  const [retry, setRetry] = useState(0)
  const request = useCallback((signal) => placesApi.get(id, signal), [id])
  const result = useAsync(request, [id, retry, revision])
  const [notice, setNotice] = useState(false)
  const place = result.data
  const saved = favorites.ids.includes(id)
  return (
    <section className="detail-page">
      <a className="back-link" href="#/">
        <Icon name="back" size={18} />
        Back to all spots
      </a>
      {result.status !== 'success' ? (
        <AsyncState
          status={result.status}
          error={result.error}
          onRetry={() => setRetry((value) => value + 1)}
        />
      ) : (
        <>
          <div className="detail-heading">
            <div>
              <p className="eyebrow">
                {place.category.toUpperCase()} · {place.city.toUpperCase()}
              </p>
              <h1>{place.name}</h1>
              <p>
                <Icon name="pin" size={18} />
                {place.address}, {place.district}, {place.city}
              </p>
            </div>
            <button
              className={`button ${saved ? 'saved-detail-button' : 'primary'}`}
              onClick={() => favorites.toggle(id)}
              aria-pressed={saved}
            >
              <Icon name="heart" filled={saved} size={18} />
              {saved ? 'Saved to your spots' : 'Save this spot'}
            </button>
          </div>
          <div className="detail-layout">
            <div>
              <div className="detail-art">
                <SpaceArt
                  category={place.category}
                  variant={place.name.length}
                  large
                />
                <span className="detail-art-label">
                  A little room to do great things.
                </span>
              </div>
              <div className="detail-description">
                <h2>Make yourself at home.</h2>
                <p>{place.description}</p>
                <div className="detail-tags">
                  <span>
                    <span
                      className={`noise-dot ${place.noise.toLowerCase()}`}
                    />
                    {place.noise} atmosphere
                  </span>
                  <span>
                    <Icon name="wifi" size={17} />
                    {place.wifi ? 'Wi-Fi available' : 'No Wi-Fi'}
                  </span>
                  <span>
                    <Icon name="plug" size={17} />
                    {place.outlets ? 'Power outlets' : 'Bring a charged laptop'}
                  </span>
                </div>
              </div>
            </div>
            <aside className="visit-panel">
              <p className="eyebrow">PLAN YOUR VISIT</p>
              <h2>A place for your next chapter.</h2>
              <dl>
                <div>
                  <dt>
                    <Icon name="clock" size={18} />
                    Daily hours
                  </dt>
                  <dd>
                    {place.opens}–{place.closes}
                  </dd>
                </div>
                <div>
                  <dt>
                    <Icon name="people" size={18} />
                    Capacity
                  </dt>
                  <dd>{place.seats} seats</dd>
                </div>
                <div>
                  <dt>
                    <Icon name="star" size={18} />
                    Demo rating
                  </dt>
                  <dd>
                    {place.rating
                      ? `${place.rating.toFixed(1)} / 5`
                      : 'Not rated yet'}
                  </dd>
                </div>
              </dl>
              <div className="visit-price">
                <strong>{formatPrice(place.price)}</strong>
                <span>
                  {place.price ? 'Illustrative access price' : 'No entry fee'}
                </span>
              </div>
              <button
                className="button primary wide"
                onClick={() => setNotice((value) => !value)}
                aria-expanded={notice}
                aria-controls="visit-note"
              >
                Before you go
                <Icon name="arrow" size={17} />
              </button>
              {notice && (
                <p className="visit-note" id="visit-note" role="status">
                  This is a demo location. Addresses, prices, hours, and ratings
                  are simulated for the project. Confirm real venues
                  independently before visiting.
                </p>
              )}
              <p className="visit-footnote">
                Bring your ideas. Find your rhythm.
              </p>
            </aside>
          </div>
        </>
      )}
    </section>
  )
}
