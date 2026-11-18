import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { useProductsByIds } from '../hooks/useProducts';

export default function FavoritesPage() {
  const favorites = useFavorites();
  const results = useProductsByIds(favorites.ids);

  const loading = results.some((r) => r.isPending);
  const failed = results.some((r) => r.isError);
  const products = results.map((r) => r.data).filter(Boolean);

  return (
    <section>
      <h1>Favorites</h1>

      {favorites.ids.length === 0 && (
        <p className="state">
          Nothing saved yet. Press “Save” on any product in the <Link to="/products">catalog</Link>.
        </p>
      )}
      {loading && favorites.ids.length > 0 && <p className="state">Loading favorites…</p>}
      {failed && <p className="error">Some products could not be loaded.</p>}

      <div className="grid">
        {products.map((p) => (
          <article className="card" key={p.id}>
            <img src={p.thumbnail} alt="" loading="lazy" />
            <h3>{p.title}</h3>
            <p className="muted">{p.category}</p>
            <p className="price">${p.price}</p>
            <div className="row">
              <button className="ghost danger" onClick={() => favorites.toggle(p.id)}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}