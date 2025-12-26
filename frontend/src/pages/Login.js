import { useState } from 'react';
import api from '../api/api';
import '../styles/auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSubdomain, setTenantSubdomain] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
        tenantSubdomain
      });

      localStorage.setItem('token', res.data.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      console.log('LOGIN ERROR 👉', err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        'Login failed'
      );
    }
  };

  return (
  <div className="login-page">
    <div className="login-card">

      <h2 className="login-title">Welcome Back</h2>
      <p className="login-subtitle">Sign in to your workspace</p>

      {error && <p className="login-error">{error}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          className="login-input"
          placeholder="Tenant Subdomain"
          value={tenantSubdomain}
          onChange={e => setTenantSubdomain(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  </div>
);

}

export default Login;
