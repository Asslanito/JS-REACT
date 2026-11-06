import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import {
  useCategories, useCreateProduct, useDeleteProduct, useProductsList, useUpdateProduct,
} from '../hooks/useProducts';
import { PAGE_SIZE } from '../services/productsService';
import ProductForm from '../components/ProductForm';

export default function ProductsPage() {
  const { user } = useAuth();
  const favorites = useFavorites();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const page = Number(params.get('page') || 1);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [search, setSearch] = useState(q);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  const { data, isPending, isError, error, isFetching, refetch } = useProductsList({ q, category, page });
  const categories = useCategories();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const remove = useDeleteProduct();

  // Writes filters/page to the URL, so every filter and page is shareable.
  const go = (next) => {
    const merged = { q, category, page, ...next };
    const clean = Object.fromEntries(
      Object.entries(merged).filter(([k, v]) => v !== '' && !(k === 'page' && v === 1))
    );
    setParams(clean);
  };

  const products = (data?.products ?? []).filter((p) => !onlyFavs || favorites.isFavorite(p.id));
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const done = (msg) => {
    setNotice(msg);
    setEditing(null);
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <section>
      <h1>Products</h1>

      <div className="filters">
        <form onSubmit={(e) => { e.preventDefault(); go({ q: search.trim(), category: '', page: 1 }); }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" />
          <button>Search</button>
        </form>
        <select value={category} onChange={(e) => { setSearch(''); go({ category: e.target.value, q: '', page: 1 }); }}>
          <option value="">All categories</option>
          {categories.data?.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        {user && (
          <label className="check">
            <input type="checkbox" checked={onlyFavs} onChange={(e) => setOnlyFavs(e.target.checked)} />
            Favorites only
          </label>
        )}
        {isFetching && !isPending && <span className="muted">Updating…</span>}
      </div>

      {user && !editing && (
        <ProductForm
          busy={create.isPending}
          onSubmit={(d) => create.mutate(d, { onSuccess: () => done('Product added (the demo API does not store it).') })}
        />
      )}
      {editing && (
        <ProductForm
          initial={editing}
          busy={update.isPending}
          onCancel={() => setEditing(null)}
          onSubmit={(d) => update.mutate({ id: editing.id, data: d }, { onSuccess: () => done('Product updated.') })}
        />
      )}
      {notice && <p className="notice" role="status">{notice}</p>}
      {(create.isError || update.isError || remove.isError) && <p className="error">Could not save the change. Try again.</p>}

      {isPending && <p className="state">Loading products…</p>}
      {isError && (
        <div className="state">
          <p className="error">{error.message}</p>
          <button onClick={() => refetch()}>Try again</button>
        </div>
      )}
      {!isPending && !isError && products.length === 0 && (
        <p className="state">{onlyFavs ? 'No favorites on this page yet.' : 'No products match your filters.'}</p>
      )}

      <div className="grid">
        {products.map((p) => (
          <article className="card" key={p.id}>
            <img src={p.thumbnail} alt="" loading="lazy" />
            <h3>{p.title}</h3>
            <p className="muted">{p.category}</p>
            <p className="price">${p.price}</p>
            {user && (
              <div className="row">
                <button
                  className={favorites.isFavorite(p.id) ? 'fav on' : 'fav'}
                  aria-pressed={favorites.isFavorite(p.id)}
                  onClick={() => favorites.toggle(p.id)}
                >
                  {favorites.isFavorite(p.id) ? 'Saved' : 'Save'}
                </button>
                <button className="ghost" onClick={() => setEditing(p)}>Edit</button>
                <button
                  className="ghost danger"
                  disabled={remove.isPending}
                  onClick={() => remove.mutate(p.id, { onSuccess: () => done('Product deleted.') })}
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="pager">
        <button className="ghost" disabled={page <= 1} onClick={() => go({ page: page - 1 })}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button className="ghost" disabled={page >= totalPages} onClick={() => go({ page: page + 1 })}>Next</button>
      </div>
    </section>
  );
}
