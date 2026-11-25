import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useProduct } from '../hooks/useProducts';
import CachedBadge from '../pwa/CachedBadge';
import './ProductDetailsPage.css';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const favorites = useFavorites();
  const { product, isPending, isError, error, fromCache, retry } = useProduct(id);

  const goBack = () => (location.key === 'default' ? navigate('/products') : navigate(-1));

  return (
    <section className="details">
      <button className="ghost" onClick={goBack}>← Back to products</button>

      {isPending && <p className="state">Loading product…</p>}
      {isError && (
        <div className="state">
          <p className="error">{error}</p>
          <button onClick={retry}>Try again</button>
        </div>
      )}

      {product && (
        <>
          {fromCache && <p><CachedBadge /></p>}
          <div className="details-body">
            {product.thumbnail && <img className="details-image" src={product.thumbnail} alt={product.title} />}
            <div className="details-info">
              <h1>{product.title}</h1>
              <p className="muted">{product.category}{product.brand ? ` · ${product.brand}` : ''}</p>
              <p className="price">${product.price}</p>
              {product.description && <p>{product.description}</p>}
              <div className="details-meta">
                {product.rating !== undefined && <span>Rating: {product.rating}</span>}
                {product.stock !== undefined && <span>In stock: {product.stock}</span>}
              </div>
              {user && (
                <button
                  className={favorites.isFavorite(product.id) ? 'fav on' : 'fav'}
                  aria-pressed={favorites.isFavorite(product.id)}
                  onClick={() => favorites.toggle(product.id)}
                >
                  {favorites.isFavorite(product.id) ? 'Saved' : 'Save'}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
