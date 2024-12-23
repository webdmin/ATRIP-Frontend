import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';  // No need to import Router
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import SigninSignup from './assets/SigninSignup'; // SignIn/SignUp modal
import Dashboard from './pages/SubscriptionPage'; // Dashboard Page (User)
import AdminDashboard from './pages/AdminDashboard'; // Admin Dashboard
import PaymentPage from './pages/Paymentpage'; // Payment Page
import Chatbot from './features/Map';
import './App.css';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const [role, setRole] = useState(localStorage.getItem('role') || null); // Track user role (user or admin)

  // Check localStorage or other persistent store to see if the user is authenticated
  useEffect(() => {
    const userAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('role'); // Assume we store role in localStorage
    setIsAuthenticated(userAuthenticated);
    setRole(userRole);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
      <Header openModal={openModal} /> {/* Pass function to Header for opening modal */}

      {/* Main container holding all content */}
      <div className="app-container">
        <div className={`main-content ${isModalOpen ? 'blurred' : ''}`}>
          {/* Routes for the different sections */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <AboutSection />
                  <ContactSection />
                  <Footer />
                </>
              }
            />

            {/* Dashboard Route (Protected route for user) */}
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
            <Route path="/chatbot" element={<ChatbotWithPaddingControl isModalOpen={isModalOpen} />} />
            <Route path="/map-chatbot" element={<ChatbotWithPaddingControl isModalOpen={isModalOpen} />} />
          </Routes>
        </div>

        {/* Conditionally render the SignIn/SignUp modal */}
        {isModalOpen && <SigninSignup closeModal={closeModal} setIsAuthenticated={setIsAuthenticated} setRole={setRole} />}
      </div>

      <div>
        <h1>Welcome to React</h1>
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

// This component ensures that useLocation is used in the correct context
const ChatbotWithPaddingControl = ({ isModalOpen }) => {
  const location = useLocation();  // useLocation is used here because it's inside Router
  console.log("Current location:", location.pathname); // Log the current location

  // Check if we are on /chatbot or /map-chatbot
  const isChatbotPage = location.pathname === '/chatbot' || location.pathname === '/map-chatbot';

  return (
    <div className={`main-content ${isChatbotPage ? 'no-padding' : ''} ${isModalOpen ? 'blurred' : ''}`} >
      <Chatbot />
    </div>
  );
};

export default App;
