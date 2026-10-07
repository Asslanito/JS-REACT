import Icon from './Icon.jsx'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="live-dot" /> LESS SCROLLING. MORE FOCUS.
        </p>
        <h1 id="hero-title">
          Good work starts
          <br />
          with a <em>good place.</em>
        </h1>
        <p>
          Your next favorite corner is out there. Discover spaces
          <br className="desktop-break" /> to study, create, and get a little
          closer to your goals.
        </p>
        <div className="hero-meta">
          <span>
            <Icon name="pin" size={16} />3 cities to explore
          </span>
          <span className="meta-divider" />
          <span>One place for your places.</span>
        </div>
      </div>
      <div className="hero-map" aria-hidden="true">
        <div className="map-road road-one" />
        <div className="map-road road-two" />
        <div className="map-road road-three" />
        <div className="map-block block-one" />
        <div className="map-block block-two" />
        <div className="map-block block-three" />
        <div className="map-park">
          <span>✳</span>
          <span>✳</span>
          <span>✳</span>
        </div>
        <div className="map-pin pin-one">
          <Icon name="book" size={23} />
        </div>
        <div className="map-pin pin-two">
          <Icon name="coffee" size={22} />
        </div>
        <div className="map-pin pin-three">
          <Icon name="work" size={22} />
        </div>
        <div className="map-note">
          <span className="note-icon">
            <Icon name="check" size={18} />
          </span>
          <div>
            Your focus, found.<small>A little change of scenery.</small>
          </div>
        </div>
        <span className="map-coordinate">43.2389° N · 76.8897° E</span>
      </div>
    </section>
  )
}
