import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Bonus feature: password reset by email.
export default function ForgotPasswordPage() {
  const { resetPassword, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      /* error is shown via context */
    }
  };

  return (
    <section className="auth">
      <h1>Reset password</h1>
      <form className="card" onSubmit={submit}>
        <label>Email<input type="email" value={email} onChange={(e) => { clearError(); setEmail(e.target.value); }} required /></label>
        {error && <p className="error" role="alert">{error.message}</p>}
        {sent && <p className="notice" role="status">Reset link sent. Check your inbox.</p>}
        <button>Send reset link</button>
        <p className="muted"><Link to="/login">Back to login</Link></p>
      </form>
    </section>
  );
}
