import Icon from './Icon.jsx'

export default function Header({ route, savedCount }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#/" aria-label="Study Atlas home">
          <span className="brand-mark">
            <Icon name="atlas" size={24} />
          </span>
          study atlas<span className="brand-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#/" aria-current={route === '/' ? 'page' : undefined}>
            Explore
          </a>
          <a
            href="#/saved"
            aria-current={route === '/saved' ? 'page' : undefined}
          >
            <Icon name="heart" size={17} /> Saved{' '}
            <span className="count">{savedCount}</span>
          </a>
        </nav>
        <a className="button header-add" href="#/add">
          <Icon name="plus" size={17} />
          <span>Add a spot</span>
        </a>
      </div>
    </header>
  )
}
