import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, login, loginWithGoogle, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/profile';

  if (user) return <Navigate to={from} replace />;

  const handle = (fn) => async (e) => {
    e?.preventDefault();
    setBusy(true);
    try {
      await fn();
      navigate(from, { replace: true });
    } catch {
      /* error is shown via context */
    }
    setBusy(false);
  };

  return (
    <section className="auth">
      <h1>Log in</h1>
      <form className="card" onSubmit={handle(() => login(email, password))}>
        <label>Email<input type="email" value={email} onChange={(e) => { clearError(); setEmail(e.target.value); }} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p className="error" role="alert">{error.message}</p>}
        <button disabled={busy}>Log in</button>
        <button type="button" className="ghost" disabled={busy} onClick={handle(loginWithGoogle)}>Continue with Google</button>
        <p className="muted"><Link to="/forgot-password">Forgot password?</Link> · <Link to="/signup">Create account</Link></p>
      </form>
    </section>
  );
}
