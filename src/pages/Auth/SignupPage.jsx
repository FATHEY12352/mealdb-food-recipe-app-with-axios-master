// src/pages/Auth/SignupPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile } from "firebase/auth";
// import './Auth.scss'; // يمكنك إنشاء هذا الملف للتنسيق

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      return setError("Please enter your name.");
    }
    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(email, password);
      if (userCredential && userCredential.user) {
         await updateProfile(userCredential.user, { displayName: name });
         console.log("Profile updated with displayName:", name);
      } else {
         console.error("User object not available after signup.");
         throw new Error("User not found after creation.");
      }
      console.log("Signup and profile update successful!");
      navigate('/');
    } catch (err) {
      console.error("Failed to create an account or update profile:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(`Failed to create account: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- الأنماط المضمنة (يفضل نقلها لملف CSS/SCSS) ---
  const styles = {
    page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: '20px', background: '#333' }, // جعل الخلفية داكنة ومراعاة ارتفاع الهيدر
    container: { background: '#fff', padding: '30px 40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
    title: { marginBottom: '20px', color: '#333', fontSize: '24px' },
    inputGroup: { marginBottom: '15px', textAlign: 'right' },
    label: { display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' },
    input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '15px' },
    button: { width: '100%', padding: '12px 15px', background: '#ff6f61', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background 0.3s ease' },
    buttonDisabled: { background: '#ffb3ac', cursor: 'not-allowed' },
    error: { color: 'red', marginBottom: '15px', fontSize: '14px', background: '#ffebee', border: '1px solid red', padding: '8px', borderRadius: '4px' }, // تحسين مظهر الخطأ
    linkText: { marginTop: '20px', fontSize: '14px', color: '#555' },
    link: { color: '#ff6f61', textDecoration: 'none', fontWeight: 'bold' }
  };
  // --- نهاية الأنماط ---

  return (
    <div className="auth-page" style={styles.page}>
      <div className="auth-container" style={styles.container}>
        <h2 style={styles.title}>Create New Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.linkText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;