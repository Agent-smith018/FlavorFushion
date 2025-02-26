import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom"; // Import Link component
import "./LoginPage.css"; // Ensure your CSS styles are correct

const Login = () => {
  const [email, setEmail] = useState(""); // Store email
  const [password, setPassword] = useState(""); // Store password
  const [error, setError] = useState(""); // Store error messages
  const navigate = useNavigate(); // React Router hook for navigation

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const auth = getAuth(); // Get Firebase auth instance

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get user details on success

      console.log("User logged in:", user);

      // Redirect to homepage (or any page you want)
      navigate("/"); // Navigate to the homepage

    } catch (error) {
      // Handle error if login fails
      console.error("Error logging in:", error.message);
      setError("Failed to login: " + error.message); // Display error message
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      {error && <div className="error-message">{error}</div>} {/* Display error if any */}

      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />

        {/* Login Button */}
        <button type="submit">Login</button>
      </form>

      {/* Forgot Password Link */}
      <div className="forgot-password">
        <Link to="/reset-password">Forgot your password?</Link>
      </div>
    </div>
  );
};

export default Login;
