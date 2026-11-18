import { useState } from 'react';

export default function ProductForm({ initial, onSubmit, onCancel, busy }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [price, setPrice] = useState(initial?.price ?? '');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('Title is required.');
    if (Number(price) <= 0) return setError('Price must be greater than 0.');
    setError('');
    onSubmit({ title: title.trim(), price: Number(price) });
  };

  return (
    <form className="card form-inline" onSubmit={submit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product title" />
      <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
      <button disabled={busy}>{initial ? 'Save changes' : 'Add product'}</button>
      {onCancel && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}
