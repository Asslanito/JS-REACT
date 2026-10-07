import Icon from './Icon.jsx'
import { categories, cities, noiseLevels } from '../lib/constants.js'

const categoryIcons = {
  'All spots': 'atlas',
  Library: 'book',
  Café: 'coffee',
  Coworking: 'work',
  'Campus room': 'campus',
}

export default function FilterBar({ filters, onChange, onReset }) {
  const active =
    filters.search ||
    filters.category !== 'All spots' ||
    filters.city !== 'All cities' ||
    filters.noise !== 'Any atmosphere' ||
    filters.freeOnly ||
    filters.wifiOnly
  return (
    <div className="filter-bar">
      <div className="search-row">
        <label className="search-field">
          <Icon name="search" />
          <span className="sr-only">Search places</span>
          <input
            type="search"
            placeholder="Search for a place, neighborhood, or a little inspiration…"
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
          />
        </label>
        <label className="city-field">
          <Icon name="pin" size={18} />
          <span className="sr-only">City</span>
          <select
            aria-label="City"
            value={filters.city}
            onChange={(event) => onChange('city', event.target.value)}
          >
            {['All cities', ...cities].map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="category-tabs" role="group" aria-label="Place type">
        {['All spots', ...categories].map((category) => (
          <button
            key={category}
            aria-pressed={filters.category === category}
            onClick={() => onChange('category', category)}
          >
            <Icon name={categoryIcons[category]} size={17} />
            {category}
          </button>
        ))}
      </div>
      <div className="filter-options">
        <div className="filter-options-left">
          <label className="atmosphere-field">
            <Icon name="filter" size={16} />
            <span className="sr-only">Atmosphere</span>
            <select
              aria-label="Atmosphere"
              value={filters.noise}
              onChange={(event) => onChange('noise', event.target.value)}
            >
              {['Any atmosphere', ...noiseLevels].map((noise) => (
                <option key={noise}>{noise}</option>
              ))}
            </select>
          </label>
          <label className="checkbox-filter">
            <input
              type="checkbox"
              checked={filters.freeOnly}
              onChange={(event) => onChange('freeOnly', event.target.checked)}
            />
            Free entry
          </label>
          <label className="checkbox-filter">
            <input
              type="checkbox"
              checked={filters.wifiOnly}
              onChange={(event) => onChange('wifiOnly', event.target.checked)}
            />
            Wi-Fi
          </label>
          {active && (
            <button className="text-button clear-filters" onClick={onReset}>
              Reset filters
              <Icon name="close" size={13} />
            </button>
          )}
        </div>
        <label className="sort-field">
          Sort by
          <select
            aria-label="Sort by"
            value={filters.sort}
            onChange={(event) => onChange('sort', event.target.value)}
          >
            <option value="recommended">Top rated</option>
            <option value="price">Lowest price</option>
            <option value="name">Name A–Z</option>
            <option value="newest">Newest first</option>
          </select>
        </label>
      </div>
    </div>
  )
}
