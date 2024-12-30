import React, { useState } from "react";

// Define the inline styles for the Pricing component
const pricingStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: "3rem",
    fontWeight: "800",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  rightSide: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px",
  },
  planLabel: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#333",
  },
  bold: {
    fontWeight: "700",
    color: "#007bff",
  },
  switch: {
    position: "relative",
    display: "inline-block",
    width: "60px",
    height: "34px",
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ccc",
    transition: ".4s",
    borderRadius: "34px",
  },
  sliderBefore: {
    position: "absolute",
    content: "",
    height: "26px",
    width: "26px",
    borderRadius: "50%",
    left: "4px",
    bottom: "4px",
    backgroundColor: "white",
    transition: ".4s",
  },
  checkedSlider: {
    backgroundColor: "#007bff",
  },
  checkedSliderBefore: {
    transform: "translateX(26px)",
  },
  plans: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
    gap: "20px",
  },
  planCard: {
    width: "300px",
    margin: "15px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease-in-out",
  },
  planCardHover: {
    transform: "scale(1.05)",
  },
  planName: {
    fontSize: "1.5rem",
    fontWeight: "500",
    color: "#333",
    marginBottom: "10px",
  },
  planPrice: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#007bff",
    marginBottom: "15px",
  },
  planFeatures: {
    listStyleType: "none",
    paddingLeft: "0",
    marginBottom: "20px",
    textAlign: "left",
  },
  planFeature: {
    marginBottom: "8px",
    fontSize: "1rem",
    color: "#555",
  },
  planButton: {
    padding: "12px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  planButtonHover: {
    backgroundColor: "#45a049",
  },
  planComparisonContainer: {
    width: "80%",
    marginTop: "40px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  comparisonTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#333",
  },
  comparisonTableHeader: {
    backgroundColor: "#4d79ff",
    textAlign: "left",
    fontWeight: "600",
  },
  comparisonTableCell: {
    padding: "12px 15px",
    border: "1px solid #ddd",
    textAlign: "center", // Centering the contents
  },
  comparisonTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

// Plan data with the new "Get in Touch" plan
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
      "✔ Access to general road data",
      "✔ Monthly email summaries",
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
      "✔ GeoJSON overlays for UK data",
      "✔ Real-time traffic updates",
    ],
  },
  {
    name: "Get in Touch",
    month: 0,
    year: 0,
    features: [
      "✔ Personalized demo",
      "✔ One-on-one consultation",
      "✔ Answer any specific queries",
      "✔ Explore custom features",
      "✔ Access to everything in standard",
      "✔ Rightmove on-market data",
      "✔ Demographic data",
    ],
  },
];

const Pricing = () => {
  const [planType, setPlanType] = useState("month");
  const [numUsers] = useState(1);

  const togglePlanType = (newPlanType) => setPlanType(newPlanType);

  const handlePlanSelection = (plan) => {
    if (plan.name === "Get in Touch") {
      alert("Booking a demo for this plan.");
    } else {
      alert(`You selected the ${plan.name} plan`);
    }
  };

  return (
    <div style={pricingStyles.container}>
      <h2 style={pricingStyles.header}>Simple pricing for any business</h2>
<h4>We offer both usage and user based pricing. So no matter how big your business, there's a solution for you.</h4>
      <div style={pricingStyles.rightSide}>
        <span
          className={`plan-label ${planType === "year" ? "bold" : ""}`}
          style={planType === "year" ? pricingStyles.bold : {}}
        >
          Billed Annually (Save 30%)
        </span>

        <label style={pricingStyles.switch} className="switch">
          <input
            type="checkbox"
            checked={planType === "year"}
            onChange={() => togglePlanType(planType === "month" ? "year" : "month")}
            style={pricingStyles.switchInput}
          />
          <span
            className="slider"
            style={{
              ...pricingStyles.slider,
              ...(planType === "year" ? pricingStyles.checkedSlider : {}),
            }}
          >
            <span
              className="slider-before"
              style={{
                ...pricingStyles.sliderBefore,
                ...(planType === "year" ? pricingStyles.checkedSliderBefore : {}),
              }}
            ></span>
          </span>
        </label>

        <span
          className={`plan-label ${planType === "month" ? "bold" : ""}`}
          style={planType === "month" ? pricingStyles.bold : {}}
        >
          Billed Monthly
        </span>
      </div>

      <div style={pricingStyles.plans}>
        {plans.map((plan) => (
          <div
            className={`plan-card ${planType === "year" ? "slide-to-right" : "slide-to-left"}`}
            style={{
              ...pricingStyles.planCard,
              ...(planType === "year" ? pricingStyles.planCardHover : {}),
            }}
            key={plan.name}
          >
            <h3 style={pricingStyles.planName}>{plan.name} Plan</h3>
            {plan.name !== "Get in Touch" && (
              <p style={pricingStyles.planPrice}>
                <span className="plan-price-amount">
                  ${planType === "month" ? plan.month * numUsers : plan.year * numUsers}
                </span>
                <span className="plan-price-period">/{planType.toLowerCase()}</span>
              </p>
            )}
            <ul style={pricingStyles.planFeatures}>
              {plan.features.map((feature, index) => (
                <li key={index} style={pricingStyles.planFeature}>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="plan-button"
              style={pricingStyles.planButton}
              onClick={() => handlePlanSelection(plan)}
            >
              {plan.name === "Get in Touch" ? "Book a demo  " : "Choose this plan"}
            </button>
          </div>
        ))}
      </div>
      <h3 style={pricingStyles.comparisonTitle}>Unsure? Let’s compare plans</h3>
      <div style={pricingStyles.planComparisonContainer}>
        
        <table style={pricingStyles.comparisonTable}>
          <thead style={pricingStyles.comparisonTableHeader}>
            <tr>
              <th style={pricingStyles.comparisonTableCell}>Features</th>
              <th style={pricingStyles.comparisonTableCell}>Standard</th>
              <th style={pricingStyles.comparisonTableCell}>Premium</th>
              <th style={pricingStyles.comparisonTableCell}>Get in Touch</th>
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr style={pricingStyles.oddRow}>
              <td style={pricingStyles.comparisonTableCell}>Price</td>
              <td style={pricingStyles.comparisonTableCell}>
                ${planType === "month" ? plans[0].month : plans[0].year}
              </td>
              <td style={pricingStyles.comparisonTableCell}>
                ${planType === "month" ? plans[1].month : plans[1].year}
              </td>
              <td style={pricingStyles.comparisonTableCell}>Free</td>
            </tr>

            {/* Chatbot Interaction Row */}
            <tr style={pricingStyles.evenRow}>
              <td style={pricingStyles.comparisonTableCell}>Chatbot Interaction</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
            </tr>

            {/* Chatbot with Map Interaction Row */}
            <tr style={pricingStyles.oddRow}>
              <td style={pricingStyles.comparisonTableCell}>Chatbot with Map Interaction</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>

            {/* Overlaying UK Data Row */}
            <tr style={pricingStyles.evenRow}>
              <td style={pricingStyles.comparisonTableCell}>Overlaying UK Data</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>

            {/* Additional Data Rows */}
            <tr style={pricingStyles.oddRow}>
              <td style={pricingStyles.comparisonTableCell}>Ownership Data</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.evenRow}>
              <td style={pricingStyles.comparisonTableCell}>Planning Application</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.oddRow}>
              <td style={pricingStyles.comparisonTableCell}>Sold Price Comparables</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.evenRow}>
              <td style={pricingStyles.comparisonTableCell}>Planning Constraints</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.oddRow}>
              <td style={pricingStyles.comparisonTableCell}>Site Sourcing Workflow</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.evenRow}>
              <td style={pricingStyles.comparisonTableCell}>HMO Data</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.oddRow}>
              <td style={pricingStyles.comparisonTableCell}>Strategic Land Data</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.evenRow}>
              <td style={pricingStyles.comparisonTableCell}>DNO Data</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.oddRow}>
              <td style={pricingStyles.comparisonTableCell}>BNG Tools</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.evenRow}>
              <td style={pricingStyles.comparisonTableCell}>Mobility Data</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.oddRow}>
              <td style={pricingStyles.comparisonTableCell}>Demographic Data</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
            <tr style={pricingStyles.evenRow}>
              <td style={pricingStyles.comparisonTableCell}>API Access</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>✔</td>
              <td style={pricingStyles.comparisonTableCell}>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pricing;
