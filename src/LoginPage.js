import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User logged in successfully.");

      // Check if the logged-in user is the admin
      if (user.uid === "UIEuQe42TUg0euOtDIvbNFLlrPJ2") {
        // Admin logged in, redirect to Admin Panel
        navigate("/admin");
      } else {
        // Regular user logged in, redirect to Personal Details Page or Dashboard
        navigate("/personal-details");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="redirect-message">
          Don't have an account?{' '}
          <span onClick={() => navigate("/register")} className="register-link">
            Register here
          </span>
        </p>

        <p className="redirect-message">
          Forgot your password?{' '}
          <span onClick={() => navigate("/reset-password")} className="reset-password-link">
            Reset Password
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
