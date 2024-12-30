import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SigninSignup.css';

const SigninSignup = ({ closeModal, setIsAuthenticated, setRole }) => {
  const [active, setActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const modalRef = useRef(null); // Reference to the modal container

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterClick = () => {
    console.log('Register Clicked');
    setActive(true);
  };

  const handleLoginClick = () => {
    console.log('Login Clicked');
    setActive(false);
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert(response.data.message);
  
      // Assume the response contains the user's email and role
      const { email, role } = response.data; // Adjust based on your server response
  
      // Save email and role to localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);
  
      setActive(false); // Toggle to signin
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
    }
  };
  

  const handleSubmitSignin = async (e) => {
    e.preventDefault();
  
    // Check for hardcoded admin credentials (admin check logic)
    if (formData.email === 'admin@akt.com' && formData.password === 'akt2024') {
      setIsAuthenticated(true);
      setRole('admin');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'admin');
      localStorage.setItem('email', 'admin@akt.com'); // Store admin email
      navigate('/admin-dashboard');
      closeModal();
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email: formData.email,
        password: formData.password,
      });
  
      const { role, email } = response.data; // Assuming the response contains email and role
      setIsAuthenticated(true);
      setRole(role);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', role);
      localStorage.setItem('email', email); // Store email in localStorage
  
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
  
      closeModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signin failed';
      alert(errorMessage);
    }
  };
  

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  console.log(active);

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className={`container ${active ? 'active' : ''}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSubmitSignup}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a
                href="https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=token&scope=email%20profile"
                className="icon google-login"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-google" style={{ color: 'black' }}></i>&nbsp; Continue with Google
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleSubmitSignin}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a
                href="https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=token&scope=email%20profile"
                className="icon google-login"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-google" style={{ color: 'black' }}></i>&nbsp; Continue with Google
              </a>
            </div>
            <span>or use your email password</span>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <a href="/">Forget Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Toggle between Sign Up and Sign In */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Hey there!</h1>
              <p>Register with your details to use our site features</p>
              <button onClick={handleLoginClick} id="login">Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Welcome Back!</h1>
              <p>Enter your details to use our features</p>
              <button onClick={handleRegisterClick} id="register">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninSignup;
