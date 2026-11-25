import { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Example responsive nav: adapt links to your routes.
export default function Navbar({ links = [{ to: '/', label: 'Home' }] }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <span className="brand">MyApp</span>
      <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
      <nav className={`nav-links ${open ? 'open' : ''}`}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</NavLink>
        ))}
      </nav>
    </header>
  );
}
