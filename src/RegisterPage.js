// import React, { useState } from 'react';
// import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
// import { auth } from './firebase';
// import { useNavigate } from 'react-router-dom';
// import './RegisterPage.css';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, password, confirmPassword } = formData;

//     // Basic validation
//     if (!name || !email || !password || !confirmPassword) {
//       setError('All fields are required');
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setLoading(true);
//     setError(''); // Reset any previous errors

//     try {
//       // Firebase registration
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//       // Send email verification
//       await sendEmailVerification(userCredential.user);

//       console.log('User registered successfully');
//       setLoading(false);

//       // Show success pop-up message
//       alert('Registration successful! A verification email has been sent. Please verify your email.');

//       // Redirect to login page
//       navigate('/login');
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const handleLoginRedirect = () => {
//     navigate('/login'); // Redirect to the login page
//   };

//   return (
//     <div className="register-page">
//       <h2>Create an Account</h2>
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Confirm Password</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit" disabled={loading}>
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//       </form>

//       {/* Login Button */}
//       <button className="login-redirect" onClick={handleLoginRedirect}>
//         Already have an account? Login here
//       </button>
//     </div>
//   );
// };

// export default RegisterPage;


import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';  // Assuming you already have styles for RegisterPage

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);
      console.log(`User signed up successfully. Verification email sent to ${user.email}`);
      
      alert('A verification email has been sent to your email address. Please verify your account before logging in.');
      navigate('/login'); // Redirect to the login page after successful registration
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create an Account</h2>
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
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="redirect-message">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Log in here</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
