import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SubscriptionPage.css";
import chatbotImage from '../images/img-1.webp';
import mapIntegrationImage from '../images/img-2.webp';
import ukDataImage from '../images/img-3.jpg';


const SubscriptionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [planType, setPlanType] = useState("month");
  const [selectedOption, setSelectedOption] = useState("Overview");
  const [faqVisibility, setFaqVisibility] = useState({});
  const [numUsers] = useState(1);
  const [purchasedFeatures, setPurchasedFeatures] = useState([]);
  const isChatbotPage = location.pathname === "/chatbot";
  const [popupMessage, setPopupMessage] = useState("");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const history = useNavigate();


  const handleLogout = () => {
    // Set the popup to visible
    setShowLogoutPopup(true);

    // After 3 seconds, redirect to the home page and hide the popup
    setTimeout(() => {
      localStorage.removeItem("userEmail"); // Clear the logged-in user's email
      history("/"); // Redirect to the home page ("/")
    }, 2000); // 3 seconds
  };

  // console.log("Is Chatbot Page: ", isChatbotPage);
  // console.log("Location object:", location);

  const loggedInUserEmail = localStorage.getItem("userEmail");
  // Utility function to check if user is admin
  const isAdmin = (loggedInUserEmail) => {
    return loggedInUserEmail === "admin@akt.com"; // Replace with the actual admin email
  };

  const togglePlanType = (type) => {
    setPlanType(type);
  };

  const toggleFAQ = (index) => {
    setFaqVisibility((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const plans = [
    {
      name: "Standard",
      month: 10,
      year: 100,
      features: [
        "✔ Chatbot for basic queries",
        "✔ Plot layers on the map",
        "✔ Add markers on the map",
        "✔ Basic navigation tools",
      ],
    },
    {
      name: "Premium",
      month: 20,
      year: 200,
      features: [
        "✔ Dynamic route display",
        "✔ Advanced map layers",
        "✔ Chatbot with advanced answers",
        "✔ Show parking bays and bus stops",
      ],
    },
  ];

  useEffect(() => {
    if (location.state) {
      if (location.state.purchasedFeatures) {
        setPurchasedFeatures(location.state.purchasedFeatures);
      }
      if (location.state.planName) {
        setPlanType(location.state.planName); // Set the plan type (Standard or Premium)
      }
    }
  }, [location.state]);


  const handlePlanSelection = (plan) => {
    // Calculate total price based on the plan and number of users
    const totalPrice = planType === "month"
      ? plan.month * numUsers
      : plan.year * numUsers;

    // Store the purchased features
    setPurchasedFeatures(plan.features);

    // Optionally navigate to a different page (e.g., Payment page or Dashboard)
    navigate("/payment", {
      state: {
        selectedPlan: plan,
        totalPrice: totalPrice,
        purchasedFeatures: plan.features, // Send purchased features to the PaymentPage
      },
    });
  };

  const [helpQuery, setHelpQuery] = useState(""); // State for the help query input
  const [showPopup, setShowPopup] = useState(false); // State for the popup visibility

  const handleHelpSubmit = () => {
    // Assuming query is sent successfully, show popup
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false); // Hide the popup after a short delay
      setSelectedOption("Overview"); // Redirect to Overview
    }, 2000);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "Overview":
        return (
          <div>
            {/* Message to encourage purchasing a plan */}
            <div className="centered-purchase-button">
              {purchasedFeatures.length === 0 ? (
                <button className="purchase-button" onClick={() => setSelectedOption("Explore Plans")}>
                  Purchase
                </button>
              ) : (
                <>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>
                    Your plan is already purchased. Explore your features below!
                  </p>

                  {/* Explore Now Button */}
                  <div className="explore-now-container">
                    <button
                      className="explore-now-btn"
                      onClick={() => {
                        // Implement any action you want, like scrolling to the feature cards section or redirecting somewhere
                        window.scrollTo(0, document.querySelector('.feature-cards-container').offsetTop);
                      }}
                    >
                      Explore Now
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Frequently Asked Questions */}
            <div className="faq">
              <h2>Frequently Asked Questions</h2>
              {[
                { question: "What is ATRIP?", answer: "ATRIP is an AI-powered tool designed to help urban planners create active travel routes by analyzing data like traffic flow, road conditions, and compliance with regulations. " },
                { question: "What features are available in the Standard Plan?", answer: "The Standard Plan includes access to the chatbot for answering queries and providing route suggestions, perfect for individual users or small teams exploring active travel options. " },
                { question: "What additional features does the Premium Plan offer?", answer: "The Premium Plan includes advanced features like interactive map integration, chatbot-map interactions, and UK-specific dataset overlays (GeoJSON). It is ideal for larger teams, city planners, or organizations needing detailed data visualization." },
                { question: "Who benefits from the Standard Plan?", answer: "The Standard Plan is great for users who need quick route insights and minimal interaction, such as solo researchers or early-stage planners. " },
                { question: "Who benefits from the Premium Plan?", answer: "The Premium Plan is designed for professionals or organizations requiring comprehensive tools for planning, including detailed datasets, map overlays, and advanced visualization capabilities." },
                { question: "Are there any hidden fees?", answer: "No, there are no hidden fees. Only payment that user will make is for subscription!" },
                { question: "How does ATRIP's billing work?", answer: "ATRIP offers both monthly and yearly subscription plans. Users opting for yearly billing receive a 30% discount compared to monthly billing." },
                { question: " What is the UK dataset overlay in the Premium Plan?", answer: "The UK dataset overlay includes GeoJSON visualizations for key infrastructure like parking areas, cycling paths, and demographic data, providing richer context for route planning." },
                { question: "What payment methods are accepted?", answer: "We accept credit cards, debit cards, PayPal, Klarna and Clearpay" },
                { question: "How can I contact customer support?", answer: "You can reach out to us via the Contact Us page for any issues or questions regarding the ATRIP tool. " },
              ].map((item, index) => (
                <div className="faq-item" key={index}>
                  <div className="faq-question">
                    <p>{item.question}</p>
                    <button
                      className="faq-toggle"
                      onClick={() => toggleFAQ(index)}
                    >
                      {faqVisibility[index] ? "-" : "+"}
                    </button>
                  </div>
                  {faqVisibility[index] && (
                    <div className="faq-answer">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        );
      case "Explore Plans":
        return (
          <div>
            <div className="plans-container">
              <div className="switch-container">
                <div className="right-side">
                  <span className={`plan-label ${planType === "year" ? "bold" : ""}`}>Billed Annually (Save 30%)</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={planType === "year"}
                      onChange={() => togglePlanType(planType === "month" ? "year" : "month")}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className={`plan-label ${planType === "month" ? "bold" : ""}`}>Billed Monthly</span>
                </div>
              </div>

              <div className="plans">
                {plans.map((plan) => (
                  <div
                    className={`plan-card ${planType === "year" ? "slide-to-right" : "slide-to-left"}`}
                    key={plan.name}
                  >
                    <h3 className="plan-name">{plan.name} Plan</h3>
                    <p className="plan-price">
                      <span className="plan-price-amount">
                        ${planType === "month" ? plan.month * numUsers : plan.year * numUsers}
                      </span>
                      <span className="plan-price-period">/{planType.toLowerCase()}</span>
                    </p>
                    <ul className="plan-features">
                      {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    <button
                      className="plan-button"
                      onClick={() => handlePlanSelection(plan)} // onClick to trigger navigate
                    >
                      Choose this plan
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="plan-comparison-container">
              <h3>Unsure? Let’s compare plans</h3>
              <table className="plan-comparison-table">
                <thead>
                  <tr>
                    <th>Features</th>
                    <th>Standard</th>
                    <th>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Price</td>
                    <td>${planType === "month" ? plans[0].month : plans[0].year}</td>
                    <td>${planType === "month" ? plans[1].month : plans[1].year}</td>
                  </tr>
                  <tr>
                    <td>Chatbot Interaction</td>
                    <td>✔</td>
                    <td>✔</td>
                  </tr>
                  <tr>
                    <td>Chatbot with Map Interaction</td>
                    <td>-</td>
                    <td>✔</td>
                  </tr>
                  <tr>
                    <td>Overlaying UK Data</td>
                    <td>-</td>
                    <td>✔</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Help":
        return (
          <div>
            <h2>Help & Support</h2>
            <p>If you are facing any issues or need assistance, please fill out the form below:</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="help-form">
                <label htmlFor="helpQuery">Describe the issue you are facing:</label>
                <textarea
                  id="helpQuery"
                  value={helpQuery}
                  onChange={(e) => setHelpQuery(e.target.value)}
                  placeholder="Describe your issue here..."
                  rows="4"
                  required
                />
              </div>
              <button
                className="send-query-button"
                onClick={handleHelpSubmit}
              >
                Send
              </button>
            </form>

            {showPopup && (
              <div className="popup">
                <p>Your Query has been sent successfully!</p>
              </div>
            )}
          </div>
        );
      default:
        return <h2>Welcome to the Dashboard</h2>;
    }
  };


  // Render feature cards if features are purchased
  const purchasedFeatureCards = [
    {
      title: "Chatbot for Basic Queries",
      description: "An interactive chatbot that can assist with general inquiries, providing instant responses and automating support.",
      redirectLink: "/chatbot",
      image: chatbotImage, // Image for this feature
    },
    {
      title: "Chatbot with Map Integration",
      description: "Get live map data along with your chatbot responses, making it easier to visualize location-based queries and directions.",
      redirectLink: "/map-chatbot",
      image: mapIntegrationImage, // Image for this feature
    },
    {
      title: "Overlay UK Data",
      description: "Access detailed UK data overlays for better planning and decision-making, especially for regional insights and analysis.",
      redirectLink: "/uk-data",
      image: ukDataImage, // Image for this feature
    }
  ];

  const displayName = isAdmin ? "Admin" : loggedInUserEmail.split("@")[0]; // "Admin" for admin, else the email prefix
  const userAccount = isAdmin ? "Admin Account" : "User Account";
  return (
    <div className="subscription-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="menu">
          <ul>
            {["Overview", "Explore Plans", "Help"].map((option) => (
              <li key={option}>
                <button
                  className={`menu-item ${selectedOption === option ? "active" : ""}`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User icon at the bottom of the sidebar */}
        <div className="profile-bottom">
          <div className="profile-info">
            <i className="fa fa-user profile-image"></i>
            <div>
              <h4>{displayName}</h4> {/* Display username */}
              <p>{userAccount}</p> {/* Admin or User Account */}
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${isChatbotPage ? 'no-padding' : ''}`}>
        {/* Conditionally render the Welcome message only in the Overview section */}
        {selectedOption === "Overview" && (
          <header className="header2">
            <h1>{loggedInUserEmail?.split("@")[0]}</h1>
          </header>
        )}

        <div className="pricing-info">
          {/* Only show the title when selectedOption is 'Explore Plans' */}
          {selectedOption === "Explore Plans" && (
            <h2>Simple pricing for all mapping requirements</h2>
          )}

          <p>
            {/* Show different text based on the selectedOption */}
            {selectedOption === "Overview"
              ? "To use our functionalities, kindly purchase a plan and get back!"
              : selectedOption === "Explore Plans"
                ? (
                  <>
                    We offer both usage and user-based pricing. So no matter how big your<br />
                    business, there's a solution for you.
                  </>
                )
                : null}  {/* No message for 'Help' section */}
          </p>
        </div>



        {/* Display purchased features */}
        {purchasedFeatures.length > 0 && selectedOption === "Overview" && (
          <div className="feature-cards-container">
            {purchasedFeatureCards.map((card, index) => {
              // Disable cards based on the selected plan
              const isDisabled =
                planType === "Standard" && index !== 0; // Disable all except the first card for Standard plan

              return (
                <div
                  className={`feature-card ${isDisabled ? "disabled-card" : ""}`}
                  key={index}
                >
                  <div className="feature-card-image">
                    <img src={card.image} alt={card.title} />
                  </div>
                  <div className="feature-card-content">
                    <h3 className="feature-card-title">{card.title}</h3>
                    <p className="feature-card-description">{card.description}</p>
                    <button
                      onClick={() => {
                        if (isDisabled) {
                          setPopupMessage("Upgrade to premium to use this functionality, Happy mapping!");
                        } else {
                          navigate(card.redirectLink);
                        }
                      }}
                      className={`use-tool-btn ${isDisabled ? "disabled-button" : ""}`}
                      disabled={isDisabled}
                    >
                      Use This Tool
                    </button>
                  </div>
                </div>
              );
            })}


          </div>
        )}

        {popupMessage && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>{popupMessage}</h3>
              <button onClick={() => setPopupMessage("")} className="popup-btn">
                OK
              </button>
            </div>
          </div>
        )}

        {showLogoutPopup && (
          <div className="logout-popup">
            <div className="popup-content">
              <h3>You have Logged out Successfully!</h3>
              {/* Optional Close Button */}
              <button className="popup-close-btn" onClick={() => setShowLogoutPopup(false)}>
                Close
              </button>
            </div>
          </div>
        )}


        {showLogoutPopup && <div className="backdrop"></div>}

        {/* Dynamic Content */}
        <div className="dynamic-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
