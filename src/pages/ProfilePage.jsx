import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <section className="auth">
      <h1>Profile</h1>
      <div className="card">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>UID:</strong> <code>{user.uid}</code></p>
        <button onClick={async () => { await logout(); navigate('/login'); }}>Logout</button>
      </div>
    </section>
  );
}
