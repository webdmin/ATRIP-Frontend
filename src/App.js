import React, { useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import SigninSignup from './assets/SigninSignup'; // SignIn/SignUp modal
import Dashboard from './pages/SubscriptionPage'; // Dashboard Page (User)
import AdminDashboard from './pages/AdminDashboard'; // Admin Dashboard
import PaymentPage from './pages/Paymentpage'; // Payment Page
import Chatbot from './features/FirstFeature';
import Document from './assets/Document'
import Pricing from './assets/Pricing'
import './App.css';
import DataSource from './components/datasource'
import UKdata from './features/ThirdFeature'
import SecondFeature from './features/SecondFeature'

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true'); // Track authentication state
  const [role, setRole] = useState(localStorage.getItem('role') || null); // Track user role (user or admin)
  const [isSignedIn, setIsSignedIn] = useState(false); // Track if user has clicked SignIn

  const location = useLocation(); // Hook to get current location

  // Inline style to remove padding on the home page
  const mainContentStyle = location.pathname === '/' ? { padding: '0' } : {};

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsSignedIn(false); // Reset signed in state when modal is closed
  };

  // ProtectedRoute component that handles authentication
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />; // Redirect to home if not authenticated
  };

  // Admin Protected Route
  const AdminProtectedRoute = ({ children }) => {
    return role === 'admin' ? children : <Navigate to="/dashboard" />; // Redirect to user dashboard if not an admin
  };

  return (
    <>
      <Header openModal={openModal} isSignedIn={isSignedIn} /> {/* Pass isSignedIn to Header */}

      {/* Main container holding all content */}
      <div className={`app-container ${isModalOpen ? 'blurred' : ''}`}>
        {/* Conditionally render padding for the main-content */}
        <div className="main-content" style={mainContentStyle}>
          {/* Routes for the different sections */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <AboutSection />
                  <DataSource/>
                  <ContactSection />
                  <Footer />
                </>
              }
            />
            {/* New Route for Document Page */}
            <Route path="/document" element={<Document />} /> {/* Added route for Document.js */}
            <Route path="/pricing" element={<Pricing />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Route (Protected route for admin) */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            {/* Payment Page Route (Protected route) */}
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />

            {/* Feature Pages */}
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/map-chatbot" element={<SecondFeature />} />
            <Route path="/uk-data" element={<UKdata />} />

          </Routes>
        </div>

        {/* Conditionally render the SignIn/SignUp modal */}
        {isModalOpen && <SigninSignup closeModal={closeModal} setIsAuthenticated={setIsAuthenticated} setRole={setRole} />}
      </div>

      <div>
        <h1 style={{ display: 'none' }}>Welcome to React</h1>
        <a
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'none' }}  // Inline style to hide the link
        >
          Learn React
        </a>
      </div>
    </>
  );
};

export default App;
