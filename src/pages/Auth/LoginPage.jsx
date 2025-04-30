// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
// import './Auth.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      console.log("Login successful!");
      navigate('/');
    } catch (err) {
      console.error("Failed to log in:", err);
       if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
         setError('Incorrect email or password.');
       } else {
         setError('Failed to log in. Please try again.');
       }
    } finally {
      setLoading(false);
    }
  };

  // --- الأنماط المضمنة (نفس أنماط SignupPage) ---
   const styles = {
    page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: '20px', background: '#333' },
    container: { background: '#fff', padding: '30px 40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
    title: { marginBottom: '20px', color: '#333', fontSize: '24px' },
    inputGroup: { marginBottom: '15px', textAlign: 'right' },
    label: { display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' },
    input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '15px' },
    button: { width: '100%', padding: '12px 15px', background: '#ff6f61', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background 0.3s ease' },
    buttonDisabled: { background: '#ffb3ac', cursor: 'not-allowed' },
    error: { color: 'red', marginBottom: '15px', fontSize: '14px', background: '#ffebee', border: '1px solid red', padding: '8px', borderRadius: '4px' },
    linkText: { marginTop: '20px', fontSize: '14px', color: '#555' },
    link: { color: '#ff6f61', textDecoration: 'none', fontWeight: 'bold' }
  };
  // --- نهاية الأنماط ---

  return (
    <div className="auth-page" style={styles.page}>
      <div className="auth-container" style={styles.container}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}>
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <p style={styles.linkText}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;