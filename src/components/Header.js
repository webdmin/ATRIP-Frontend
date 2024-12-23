import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; // To access the current route
import './Header.css';

import logoImage from '../images/logo.png'; // Adjust the path to your logo image

const Header = ({ openModal }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false); // Track if user has signed in
  const location = useLocation(); // Get current route

  // Check the localStorage for the sign-in state and the current page when component loads
  useEffect(() => {
    const savedSignInState = localStorage.getItem('isSignedIn');
    if (savedSignInState === 'true') {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  }, []);

  // Reset to show SignIn button when the user is on the homepage ("/")
  useEffect(() => {
    if (location.pathname === '/') {
      setIsSignedIn(false); // Show Sign In button on home page
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignInClick = () => {
    setIsSignedIn(true); // Set to true when the user clicks Sign In
    localStorage.setItem('isSignedIn', 'true'); // Store sign-in state in localStorage
    openModal(); // Open the modal (this may redirect or open a form)
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logoImage} alt="Logo" className="logo-image" />
        <Link to="/">
          <h1>ATRIP</h1>
        </Link>
      </div>
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li className="dropdown">
            <a href="#software">Software</a>
            <div className="dropdown-content">
              {/* Adjust link for the dropdown */}
              <a href="/">ATRIP</a>
            </div>
          </li>
          <li className="dropdown">
            <a href="#about">About</a>
            <div className="dropdown-content">
              <a href="/about-us">About Us</a>
              <a href="/our-team">Our Team</a>
              <a href="/about-atrip">About ATRIP</a>
            </div>
          </li>
          <li className="dropdown">
            <a href="#services">Services</a>
            <div className="dropdown-content">
              <a href="/service-1">Book a Demo</a>
              <a href="/service-2">Products</a>
              <a href="/service-3">Help</a>
            </div>
          </li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Conditionally render the Sign In button */}
      {!isSignedIn && location.pathname === '/' && ( // Show on home page only if not signed in
        <div className="auth-buttons">
          <button onClick={handleSignInClick} className="signin-btn">Sign In</button>
        </div>
      )}
    </header>
  );
};

export default Header;
