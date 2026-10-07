import Icon from './Icon.jsx'

export default function AsyncState({
  status,
  error,
  onRetry,
  emptyTitle,
  emptyCopy,
  onReset,
  children,
}) {
  if (status === 'loading')
    return (
      <div className="loading-state" role="status">
        <div className="loading-label">
          <span className="spinner" />
          Finding your next good place…
        </div>
        <div className="place-grid" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((id) => (
            <div key={id} className="skeleton-card">
              <div />
              <span />
              <span />
              <span />
            </div>
          ))}
        </div>
      </div>
    )
  if (status === 'error')
    return (
      <div className="empty-state" role="alert">
        <span className="empty-icon">
          <Icon name="wifi" size={28} />
        </span>
        <h2>We couldn’t load the places.</h2>
        <p>{error}</p>
        <div className="state-actions">
          <button className="button primary" onClick={onRetry}>
            Try again
          </button>
          {children}
        </div>
      </div>
    )
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name="search" size={28} />
      </span>
      <h2>{emptyTitle}</h2>
      <p>{emptyCopy}</p>
      {onReset && (
        <button className="button primary" onClick={onReset}>
          Reset filters
        </button>
      )}
      {children}
    </div>
  )
}
