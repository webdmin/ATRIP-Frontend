import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Header.css'; // No need to modify the background in this file

import logoImage from '../images/logo.png'; // Adjust the path to your logo image

const Header = ({ openModal, isSignedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);  // Track if scrolled
  const location = useLocation();

  // Effect to handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // You can change 100 to any value depending on when you want the background to change
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add event listener on mount
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignInClick = () => {
    openModal();
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
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
              {/* Update this link to redirect to the new document page */}
              <Link to="/document">ATRIP</Link>  {/* This now links to /document */}
            </div>
          </li>
          <li className="dropdown">
            <a href="#services">Services</a>
            <div className="dropdown-content">
              <a href="/service-2">Products</a>
              <a href="/service-3">Help</a>
            </div>
          </li>
          <li className="dropdown">
          <Link to="/pricing">Pricing</Link> 
            
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
      {!isSignedIn && location.pathname === '/' && (
        <div className="auth-buttons">
          <button onClick={handleSignInClick} className="signin-btn">Sign In</button>
        </div>
      )}
    </header>
  );
};

export default Header;
