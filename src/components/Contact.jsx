export default function Contact() {
  return (
    <section
      id="contact"
      className="contact-section container"
      aria-labelledby="contact-title"
    >
      <div className="contact-card">
        <div>
          <p className="eyebrow">03 / LET'S CONNECT</p>
          <h2 id="contact-title">
            Good things start
            <br />
            with a <em>hello.</em>
          </h2>
          <p>Learning something new too? Let's exchange ideas.</p>
          <a
            className="button primary"
            href="https://github.com/Asslanito"
            target="_blank"
            rel="noreferrer"
          >
            Find me on GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="contact-details">
          <div>
            <span>MY INTERNET CORNER</span>
            <a
              href="https://github.com/Asslanito"
              target="_blank"
              rel="noreferrer"
            >
              github.com/Asslanito ↗
            </a>
          </div>
          <div>
            <span>BASED SOMEWHERE ON</span>
            <p>
              Planet Earth <span aria-hidden="true">◎</span>
            </p>
          </div>
          <div>
            <span>CURRENT STATUS</span>
            <p>
              <span className="green-dot" /> Learning & building
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
