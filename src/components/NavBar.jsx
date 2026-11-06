import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar({ theme, onToggleTheme }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="nav">
      <NavLink to="/" className="brand">ShopDesk</NavLink>
      <nav>
        <NavLink to="/products">Products</NavLink>
        {!loading && !user && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
          </>
        )}
        {!loading && user && (
          <>
            <NavLink to="/profile">Profile</NavLink>
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
