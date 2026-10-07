import Icon from './Icon.jsx'

export default function Pagination({ page, pages, total, onChange }) {
  if (pages <= 1) return null
  const visiblePages = [
    ...new Set(
      [1, page - 1, page, page + 1, pages].filter(
        (value) => value > 0 && value <= pages,
      ),
    ),
  ].sort((a, b) => a - b)
  return (
    <nav className="pagination" aria-label="Catalog pagination">
      <span>{total} places, plenty of possibilities.</span>
      <div>
        <button
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          <Icon name="back" size={16} />
        </button>
        {visiblePages.map((value, index) => (
          <span className="page-slot" key={value}>
            {index > 0 && value - visiblePages[index - 1] > 1 && (
              <span className="page-gap">…</span>
            )}
            <button
              aria-label={`Page ${value}`}
              aria-current={value === page ? 'page' : undefined}
              onClick={() => onChange(value)}
            >
              {value}
            </button>
          </span>
        ))}
        <button
          aria-label="Next page"
          disabled={page === pages}
          onClick={() => onChange(page + 1)}
        >
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </nav>
  )
}
