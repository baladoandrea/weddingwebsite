import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user || !pass) {
      setError('Introduce usuario y contraseña');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password: pass }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        sessionStorage.setItem('adminToken', data.token);
        router.push('/admin-panel');
        return;
      }

      setError(data.error || 'Usuario o contraseña incorrectos');
    } catch (error) {
      setError('No se pudo iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Acceso Admin</h1>
          <p>Boda de Marta & Sergio</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="user">Usuario</label>
            <input
              id="user"
              type="text"
              placeholder="admin"
              value={user}
              onChange={e => setUser(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <a href="/" className="back-link">
          ← Volver a la web
        </a>
      </div>
    </div>
  );
}