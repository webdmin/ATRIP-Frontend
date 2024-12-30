import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';  // Import Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>  {/* Wrap the entire app in Router here */}
    <App />
  </Router>,
);

reportWebVitals();
