export default function Hero() {
  return (
    <section id="home" className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="green-dot" /> STUDENT. CURIOUS MIND. BUILDER.
        </p>
        <h1 id="hero-title">
          Hi, I'm <em>Aslan.</em>
          <br />
          Figuring it out.
          <br />
          <span className="muted-title">Building as I go.</span>
        </h1>
        <p className="hero-description">
          I'm learning JavaScript and React, turning small ideas into things you
          can click, explore, and use.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#projects">
            See what I'm building <span aria-hidden="true">↗</span>
          </a>
          <a
            className="github-link"
            href="https://github.com/Asslanito"
            target="_blank"
            rel="noreferrer"
          >
            My GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="current-note">
          <span className="note-line" />
          <p>
            CURRENTLY LEARNING
            <br />
            <strong>A little JavaScript. A lot of possibilities.</strong>
          </p>
        </div>
      </div>
      <div className="hero-art">
        <img
          src={`${import.meta.env.BASE_URL}profile.svg`}
          alt="An illustrated green A monogram with JavaScript and code symbols"
          width="600"
          height="650"
          fetchPriority="high"
        />
        <div className="art-caption">
          <span className="spark" aria-hidden="true">
            ✳
          </span>{' '}
          Small steps. Real progress.
        </div>
      </div>
    </section>
  )
}
