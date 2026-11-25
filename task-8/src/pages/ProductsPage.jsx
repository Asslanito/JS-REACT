import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useCategories, useProductActions, useProductsList } from '../hooks/useProducts';
import ProductForm from '../components/ProductForm';
import CachedBadge from '../pwa/CachedBadge';

const SORTS = {
  '': { label: 'Default order' },
  'price-asc': { label: 'Price: low to high', sortBy: 'price', order: 'asc' },
  'price-desc': { label: 'Price: high to low', sortBy: 'price', order: 'desc' },
  'title-asc': { label: 'Title: A to Z', sortBy: 'title', order: 'asc' },
  'title-desc': { label: 'Title: Z to A', sortBy: 'title', order: 'desc' },
};

export default function ProductsPage() {
  const { user } = useAuth();
  const favorites = useFavorites();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || '';
  const page = Number(params.get('page') || 1);
  const sortConfig = SORTS[sort] || SORTS[''];

  const [onlyFavs, setOnlyFavs] = useState(false);
  const [search, setSearch] = useState(q);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  const list = useProductsList(
    { q, category, page, sortBy: sortConfig.sortBy, order: sortConfig.order },
    onlyFavs
  );
  const categories = useCategories();
  const actions = useProductActions();

  const go = (next) => {
    const merged = { q, category, page, sort, ...next };
    const clean = Object.fromEntries(
      Object.entries(merged).filter(([key, value]) => value !== '' && value !== undefined && !(key === 'page' && value === 1))
    );
    setParams(clean);
  };

  useEffect(() => {
    if (debouncedSearch !== q) go({ q: debouncedSearch, category: '', page: 1 });
  }, [debouncedSearch]);

  const done = (message) => {
    setNotice(message);
    setEditing(null);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleCreate = async (data) => {
    try {
      await actions.create(data);
      done('Product added (the demo API does not store it, so it lives in the app state).');
    } catch {
      return;
    }
  };

  const handleUpdate = async (data) => {
    try {
      await actions.update(editing.id, data);
      done('Product updated.');
    } catch {
      return;
    }
  };

  const handleRemove = async (id) => {
    try {
      await actions.remove(id);
      done('Product deleted.');
    } catch {
      return;
    }
  };

  return (
    <section>
      <h1>Products</h1>

      <div className="filters">
        <form onSubmit={(event) => { event.preventDefault(); go({ q: search.trim(), category: '', page: 1 }); }}>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
          <button>Search</button>
        </form>
        <select
          value={category}
          onChange={(event) => { setSearch(''); go({ category: event.target.value, q: '', page: 1 }); }}
        >
          <option value="">All categories</option>
          {categories.items.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
        <select value={sort} onChange={(event) => go({ sort: event.target.value, page: 1 })} aria-label="Sort products">
          {Object.entries(SORTS).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
        </select>
        {user && (
          <label className="check">
            <input type="checkbox" checked={onlyFavs} onChange={(event) => setOnlyFavs(event.target.checked)} />
            Favorites only
          </label>
        )}
        {list.isFetching && !list.isPending && <span className="muted">Updating…</span>}
      </div>

      {list.fromCache && <p><CachedBadge /></p>}

      {user && !editing && <ProductForm busy={actions.isPending} onSubmit={handleCreate} />}
      {editing && (
        <ProductForm
          initial={editing}
          busy={actions.isPending}
          onCancel={() => setEditing(null)}
          onSubmit={handleUpdate}
        />
      )}
      {notice && <p className="notice" role="status">{notice}</p>}
      {actions.mutation.status === 'failed' && (
        <p className="error">{actions.mutation.error || 'Could not save the change. Try again.'}</p>
      )}

      {list.isPending && <p className="state">Loading products…</p>}
      {list.isError && (
        <div className="state">
          <p className="error">{list.error}</p>
          <button onClick={list.retry}>Try again</button>
        </div>
      )}
      {!list.isPending && !list.isError && list.products.length === 0 && (
        <p className="state">{onlyFavs ? 'No favorites on this page yet.' : 'No products match your filters.'}</p>
      )}

      <div className="grid">
        {list.products.map((product) => (
          <article className="card" key={product.id}>
            {product.thumbnail && (
              <Link to={`/products/${product.id}`}>
                <img src={product.thumbnail} alt="" loading="lazy" />
              </Link>
            )}
            <h3><Link to={`/products/${product.id}`}>{product.title}</Link></h3>
            <p className="muted">{product.category}</p>
            <p className="price">${product.price}</p>
            {user && (
              <div className="row">
                <button
                  className={favorites.isFavorite(product.id) ? 'fav on' : 'fav'}
                  aria-pressed={favorites.isFavorite(product.id)}
                  onClick={() => favorites.toggle(product.id)}
                >
                  {favorites.isFavorite(product.id) ? 'Saved' : 'Save'}
                </button>
                <button className="ghost" onClick={() => setEditing(product)}>Edit</button>
                <button className="ghost danger" disabled={actions.isPending} onClick={() => handleRemove(product.id)}>
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="pager">
        <button className="ghost" disabled={page <= 1} onClick={() => go({ page: page - 1 })}>Previous</button>
        <span>Page {page} of {list.totalPages}</span>
        <button className="ghost" disabled={page >= list.totalPages} onClick={() => go({ page: page + 1 })}>Next</button>
      </div>
    </section>
  );
}
