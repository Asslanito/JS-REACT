import Icon from './Icon.jsx'
import SpaceArt from './SpaceArt.jsx'
import { formatPrice } from '../lib/constants.js'

export default function PlaceCard({ place, saved, onToggle }) {
  return (
    <article className="place-card">
      <div className="card-art">
        <a href={`#/places/${place.id}`} tabIndex={-1} aria-hidden="true">
          <SpaceArt category={place.category} variant={place.name.length} />
        </a>
        <span className="category-label">{place.category}</span>
        <button
          className={`save-button ${saved ? 'is-saved' : ''}`}
          aria-label={`${saved ? 'Unsave' : 'Save'} ${place.name}`}
          aria-pressed={saved}
          onClick={() => onToggle(place.id)}
        >
          <Icon name="heart" size={18} filled={saved} />
        </button>
      </div>
      <div className="card-body">
        <div className="card-title-row">
          <h3>
            <a href={`#/places/${place.id}`}>{place.name}</a>
          </h3>
          <span className="rating">
            <Icon name="star" size={13} filled />
            {place.rating ? place.rating.toFixed(1) : 'New'}
          </span>
        </div>
        <p className="card-location">
          <Icon name="pin" size={14} />
          {place.district}, {place.city}
        </p>
        <div className="card-amenities">
          <span>
            {place.wifi ? (
              <>
                <Icon name="wifi" size={14} />
                Wi-Fi
              </>
            ) : (
              'Offline-friendly'
            )}
          </span>
          <span>
            <span className={`noise-dot ${place.noise.toLowerCase()}`} />
            {place.noise}
          </span>
          {place.outlets && (
            <span>
              <Icon name="plug" size={14} />
              Outlets
            </span>
          )}
        </div>
        <div className="card-footer">
          <strong className={place.price === 0 ? 'free' : ''}>
            {formatPrice(place.price)}
          </strong>
          <a href={`#/places/${place.id}`} aria-label={`View ${place.name}`}>
            <Icon name="arrow" size={19} />
          </a>
        </div>
      </div>
    </article>
  )
}
