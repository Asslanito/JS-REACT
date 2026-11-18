import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnlineStatus } from './usePWA';
import { getCachedProducts } from './cachedProducts';

export default function OfflinePage() {
  const online = useOnlineStatus();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [items, setItems] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getCachedProducts().then(({ products, updatedAt }) => {
      setItems(products);
      setUpdatedAt(updatedAt);
    });
  }, []);

  const retry = async () => {
    setMsg('Checking connection...');
    try {
      await fetch('/manifest.webmanifest', { cache: 'no-store' });
      navigate('/');
    } catch {
      setMsg('Still offline. Saved products below are still available.');
    }
  };

  const shown = items.filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <main className="offline-page">
      <div className="offline-card">
        <div className="offline-icon">📡</div>
        <h1>{online ? 'Connection restored' : "You're offline"}</h1>
        <p>{online ? 'You can continue using the app.' : 'No internet, but you can still browse products you viewed earlier.'}</p>
        <button className="btn" onClick={retry}>Retry Connection</button>
        <p role="status">{msg}</p>
      </div>

      <section className="offline-saved">
        <h2>Saved products ({items.length})</h2>
        {updatedAt && <p className="muted">Last updated: {new Date(updatedAt).toLocaleString()}</p>}
        {items.length === 0 ? (
          <p className="muted">Nothing saved yet. Open the Products page while online and it will appear here.</p>
        ) : (
          <>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search saved products" />
            <div className="grid">
              {shown.map((p) => (
                <article className="card" key={p.id}>
                  <img src={p.thumbnail} alt="" loading="lazy" />
                  <h3>{p.title}</h3>
                  <p className="muted">{p.category}</p>
                  <p className="price">${p.price}</p>
                </article>
              ))}
            </div>
            {shown.length === 0 && <p className="muted">No saved products match your search.</p>}
          </>
        )}
      </section>
    </main>
  );
}
