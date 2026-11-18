import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar({ theme, onToggleTheme }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    close();
    navigate('/login');
  };

  return (
    <header className="nav">
      <NavLink to="/" className="brand" onClick={close}>ShopDesk</NavLink>
      <button
        className="burger"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? '✕' : '☰'}
      </button>
      <nav className={open ? 'open' : ''}>
        <NavLink to="/products" onClick={close}>Products</NavLink>
        {!loading && !user && (
          <>
            <NavLink to="/login" onClick={close}>Login</NavLink>
            <NavLink to="/signup" onClick={close}>Sign up</NavLink>
          </>
        )}
        {!loading && user && (
          <>
            <NavLink to="/profile" onClick={close}>Profile</NavLink>
            <button className="link" onClick={handleLogout}>Logout</button>
          </>
        )}
        <button className="link" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </nav>
    </header>
  );
}