// src/ResetPasswordPage.js
import React, { useState } from 'react';
import { auth } from './firebase';  // Ensure you've set up Firebase authentication
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Firebase password reset logic
      await auth.sendPasswordResetEmail(email);
      setSuccessMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      setLoading(false);
      console.error('Error sending password reset email:', err.message);
      if (err.code === 'auth/user-not-found') {
        setError('No user found with this email. Please check the email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format. Please enter a valid email.');
      } else {
        setError('Error sending password reset email. Please try again.');
      }
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
