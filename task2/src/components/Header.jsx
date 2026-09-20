export default function Header() {
  return (
    <header className="site-header container">
      <a href="#home" className="wordmark" aria-label="Aslan home">
        aslan<span>.</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact" className="nav-contact">
          Say hello <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  )
}
