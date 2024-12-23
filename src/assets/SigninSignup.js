import React, { useState } from 'react';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterClick = () => {
    setActive(true);
  };

  const handleLoginClick = () => {
    setActive(false);
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert(response.data.message);
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
      navigate('/admin-dashboard');
      closeModal();
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email: formData.email,
        password: formData.password,
      });
  
      const { role } = response.data;
      setIsAuthenticated(true);
      setRole(role);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', role);
  
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
  

  return (
    <div className="modal-overlay">
      <div className={`container ${active ? 'active' : ''}`} id="container">
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
                <i className="fa-brands fa-google" style={{color: 'black'}}></i>&nbsp; Continue with Google
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <button type="submit">Sign Up</button>
          </form>
        </div>

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
                <i className="fa-brands fa-google" style={{color: 'black'}}></i>&nbsp; Continue with Google
              </a>
            </div>
            <span>or use your email password</span>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <a href="/">Forget Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Hey there!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" onClick={handleLoginClick} id="login">Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Welcome Back!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="hidden" onClick={handleRegisterClick} id="register">Sign Up</button>
            </div>
          </div>
        </div>

        <button
          className={`close-modal ${active ? 'close-modal-signup' : 'close-modal-signin'}`}
          onClick={closeModal}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default SigninSignup;
