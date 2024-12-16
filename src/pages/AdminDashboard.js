import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminDashboard.module.css";
import chatbotImage from '../images/img-1.webp';
import mapIntegrationImage from '../images/img-2.webp';
import ukDataImage from '../images/img-3.jpg';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [planType, setPlanType] = useState("month");
  const [selectedOption, setSelectedOption] = useState("Overview");
  const [userEmail] = useState("karthik@gmail.com");
  const [numUsers] = useState(1);
  const [purchasedFeatures, setPurchasedFeatures] = useState([]);
  const isChatbotPage = location.pathname === "/chatbot";
  const [popupMessage, setPopupMessage] = useState("");


  console.log("Is Chatbot Page: ", isChatbotPage);
  console.log("Location object:", location);


  const togglePlanType = (type) => {
    setPlanType(type);
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

  const renderContent = () => {
    switch (selectedOption) {
      case "Overview":
        return (
          <div>
            {/* Message to encourage purchasing a plan */}




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

  return (
    <div className="subscription-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="menu">
          <ul>
            {["Overview", "User Data", "CRUD"].map((option) => (
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
              <h4>{userEmail.split("@")[0]}</h4>
              <p>Admin Account</p>
            </div>
          </div>
          <button className="logout-button">Logout</button>
        </div>
      </aside>

      <div className="main-content">
        {/* Conditionally render the Welcome message only in the Overview section */}
        {selectedOption === "Overview" && (
          <header className="header2">
            <h1>Welcome, {userEmail.split("@")[0]}</h1>
          </header>
        )}

        {/* Boxes side by side */}
        <div className="box-container">
          <div className="left-box">
            <h3>Left Box</h3>
            <p>This is the red-colored box</p>
          </div>
          <div className="right-box">
            <h3>Right Box</h3>
            <p>This is the yellow-colored box</p>
          </div>
        </div>

        {/* Remaining content */}
        <div className="pricing-info">
          {selectedOption !== "Overview" && <h2>User Data</h2>}
        </div>

        {/* Dynamic Content */}
        <div className="dynamic-content">{renderContent()}</div>
      </div>

    </div>
  );
};

export default AdminDashboard;
