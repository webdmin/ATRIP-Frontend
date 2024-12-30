import React from "react";
import "./Footer.css";
import logo from "../images/logo.png"; // Replace with the actual path to your logo

const Footer = () => {
  return (
    <>
      {/* Book a Demo Banner */}
      <div className="demo-banner">
        <div className="demo-content">
          <h2>Book a demo or free trial</h2>
          <p>One of our experts can walk you through the platform in a live session, one-to-one.</p>
        </div>
        <button className="demo-button">Request a demo</button>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <h3>Stay up to date with the latest planning industry and market insights.</h3>
          <div className="subscription-form">
            <input type="email" placeholder="Email" />
            <button className="subscribe-button">Subscribe</button>
          </div>
        </div>

        <div className="footer-content">
          <div className="footer-logo-section">
            <img src={logo} alt="Company Logo" className="footer-logo" />
            <h4 className="company-name">Adept Knowledge<br /> Technologies</h4>
            <p className="contact-text" >Contact Us :
            </p>
            <div className="social-icons-02">
              <a href="https://www.linkedin.com/company/ak-tech-group/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin" style={{ fontSize: "2rem" }}></i>
              </a>
            </div>
          </div>


          <div className="footer-links">
            <div className="footer-column">
              <h4>Use cases</h4>
              <ul>
                <li>Site sourcing</li>
                <li>Directions</li>
                <li>Planning Permission</li>
                <li>Cycle Path</li>
                <li>DNO data</li>
                <li>Ownership data</li>
                <li>Planning constraints</li>
              </ul>
            </div>  

            <div className="footer-column">
              <h4>Client cases</h4>
              <ul>
                <li>Developers</li>
                <li>Planners</li>
                <li>New homes</li>
                <li>Energy providers</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li>Success stories</li>
                <li>Blog</li>
                <li>Guides</li>
                <li>Webinars</li>
                <li>Pricing</li>
                <li>Login</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li>Contact Us</li>
                <li>About Us</li>
                <li>Careers</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; Adept Knowledge Technologies 2024</p>
          <div className="legal-links">
            <a href="/">Terms of Use</a>
            <span>|</span>
            <a href="/">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
