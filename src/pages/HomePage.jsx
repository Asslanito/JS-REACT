import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="hero">
      <h1>Find it, save it, manage it.</h1>
      <p>Browse the catalog, filter by category, and keep a personal list of favorites once you sign in.</p>
      <Link className="btn" to="/products">Browse products</Link>
    </section>
  );
}
