import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCreditCard, FaPaypal, FaMoneyCheckAlt, FaWallet } from "react-icons/fa"; // Import icons for payment methods
import "./PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPlan = { name: "Premium Plan", features: [] }, totalPrice = 49.99 } = location.state || {}; // Default values for fallback

  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handlePaymentMethodChange = (method) => setPaymentMethod(method);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
  
    // Simulate API call and show the success popup
    setTimeout(() => {
      setIsProcessing(false);
      setShowPopup(true); // Show the popup after payment is processed
  
      // Redirect to the dashboard after payment is successful
      navigate("/dashboard", {
        state: {
          purchasedFeatures: selectedPlan.features,
          planName: selectedPlan.name, // Add plan name to the state
        },
      });
      
    }, 2000);
  };
  

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/dashboard"); // Redirect after closing the popup
  };

  const gst = (totalPrice * 0.02).toFixed(2); // 2% GST
  const grossTotal = (parseFloat(totalPrice) + parseFloat(gst)).toFixed(2);

  return (
    <div className="payment-page-container">
      {/* Right Side Payment Methods */}
      <div className="payment-content">
        <div className="payment-header">
          <h2>SECURE PAYMENT</h2>
          <p>Choose your preferred payment method</p>
        </div>

        <div className="payment-body">
          <div className="payment-method-switch">
            <button
              className={`payment-option ${paymentMethod === "creditCard" ? "active" : ""}`}
              onClick={() => handlePaymentMethodChange("creditCard")}
            >
              <FaCreditCard className="icon" /> Credit/Debit Card
            </button>
            <button
              className={`payment-option ${paymentMethod === "paypal" ? "active" : ""}`}
              onClick={() => handlePaymentMethodChange("paypal")}
            >
              <FaPaypal className="icon" /> PayPal
            </button>
            <button
              className={`payment-option ${paymentMethod === "klarna" ? "active" : ""}`}
              onClick={() => handlePaymentMethodChange("klarna")}
            >
              <FaMoneyCheckAlt className="icon" /> Klarna
            </button>
            <button
              className={`payment-option ${paymentMethod === "clearpay" ? "active" : ""}`}
              onClick={() => handlePaymentMethodChange("clearpay")}
            >
              <FaWallet className="icon" /> Clearpay
            </button>
          </div>

          <form className="payment-form" onSubmit={handlePaymentSubmit}>
            {paymentMethod === "creditCard" && (
              <div className="form-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="Tony Stark" required />
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9876 5432" maxLength="16" required />
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" maxLength="5" required />
                <label>CVC</label>
                <input type="text" placeholder="123" maxLength="3" required />
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="form-group">
                <label>PayPal Email</label>
                <input type="email" placeholder="john.doe@example.com" required />
              </div>
            )}

            {paymentMethod === "klarna" && (
              <div className="form-group">
                <label>Klarna Details</label>
                <input type="text" placeholder="John Doe, Klarna Account" required />
              </div>
            )}

            {paymentMethod === "clearpay" && (
              <div className="form-group">
                <label>Clearpay Details</label>
                <input type="text" placeholder="john.doe@clearpay.com" required />
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Left Side Order Summary */}
      <div className="order-summary">
        <h2>ORDER SUMMARY</h2>
        <div className="summary-details">
          <div className="summary-item plan-item">
            <strong>Selected Plan -&nbsp;</strong> {selectedPlan.name || "Standard Plan"}
          </div>

          <div className="summary-item">
            <strong>Features:</strong>
          </div>
          <div className="summary-item feature-list">
            <ul>
              {selectedPlan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="summary-item price-item">
            <strong>Total Price:</strong>
            <span className="price">${parseFloat(totalPrice).toFixed(2)}</span>
          </div>
          <div className="summary-item price-item">
            <strong>GST (2%):</strong>
            <span className="price">${gst}</span>
          </div>
          <div className="summary-item price-item">
            <strong>Gross Total:</strong>
            <span className="gross-total">${grossTotal}</span>
          </div>
        </div>

        <button
          className="pay-now-btn"
          onClick={handlePaymentSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Payment Successful!</h3>
            <p>Your payment has been processed successfully.</p>
            <button onClick={handlePopupClose} className="popup-btn">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
