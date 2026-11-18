import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { user, signup, loginWithGoogle, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [problem, setProblem] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to="/profile" replace />;

  const set = (k) => (e) => {
    clearError();
    setProblem('');
    setForm({ ...form, [k]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(form.email)) return setProblem('Enter a valid email address.');
    if (form.password.length < 6) return setProblem('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setProblem('Passwords do not match.');
    setBusy(true);
    try {
      await signup(form.email, form.password);
      navigate('/profile', { replace: true });
    } catch {
      /* error is shown via context */
    }
    setBusy(false);
  };

  const google = async () => {
    setBusy(true);
    try {
      await loginWithGoogle();
      navigate('/profile', { replace: true });
    } catch {
      /* error is shown via context */
    }
    setBusy(false);
  };

  return (
    <section className="auth">
      <h1>Create account</h1>
      <form className="card" onSubmit={submit} noValidate>
        <label>Email<input type="email" value={form.email} onChange={set('email')} /></label>
        <label>Password<input type="password" value={form.password} onChange={set('password')} /></label>
        <label>Confirm password<input type="password" value={form.confirm} onChange={set('confirm')} /></label>
        {(problem || error) && <p className="error" role="alert">{problem || error.message}</p>}
        <button disabled={busy}>Sign up</button>
        <button type="button" className="ghost" disabled={busy} onClick={google}>Sign up with Google</button>
        <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </section>
  );
}
