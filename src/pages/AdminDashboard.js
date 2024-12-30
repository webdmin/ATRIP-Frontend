import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./SubscriptionPage.css";
import Chart from "react-apexcharts"; // Assuming you are using react-apexcharts
import styles from "./AdminDashboard.module.css";

const loggedInUserEmail = localStorage.getItem("email");
const loggedInUserRole = localStorage.getItem("role");
console.log(loggedInUserEmail);
console.log(loggedInUserRole);
// Utility function to check if user is admin

const SubscriptionPage = () => {
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("Overview");
  const [userData, setUserData] = useState([]); // State to store user data
  const isChatbotPage = location.pathname === "/chatbot";
  // New state for CRUD operations
  const [editingUser, setEditingUser] = useState(null); // Store the user being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [editMessage, setEditMessage] = useState(""); // Message for saving data


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Store user to be deleted
  const [isAdmin, setIsAdmin] = useState(false);

  const userEngagementData = [10, 5, 30, 12, 50];  // Data for User Engagement
  const webpageReachData = [5, 12, 10, 35, 55];
  // Open the delete confirmation modal
  const handleDeleteClick = (user) => {
    setUserToDelete(user); // Set the user to be deleted
    setIsDeleteModalOpen(true); // Open the modal
  };

  useEffect(() => {
    const loggedInUserRole = localStorage.getItem("role");
    setIsAdmin(loggedInUserRole === "admin"); // Update isAdmin state after component mounts
  }, []); 

  console.log(isAdmin);
  // Close the delete modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false); // Close the modal without deleting
    setUserToDelete(null); // Clear the selected user
  };

  // Confirm and delete the user
  const handleConfirmDelete = () => {
    setUserData(userData.filter((user) => user._id !== userToDelete._id)); // Remove user from the data
    setIsDeleteModalOpen(false); // Close the modal after deletion
    setUserToDelete(null); // Clear the selected user
  };

  // Fetch user data from the backend when component mounts
  useEffect(() => {
    console.log("Component mounted");
    axios
      .get("http://localhost:5000/data")
      .then((response) => {
        const data = response.data;
        console.log("Fetched data:", data);
        if (Array.isArray(data)) {
          setUserData(data);
        } else {
          console.error("Data is not an array:", data);
          setUserData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setUserData([]);
      });
  }, []);  // Empty dependency array ensures this only runs once when component mounts

  const displayName = isAdmin ? "Admin" : "User" ;
  const userAccount = isAdmin ? "Admin Account" : "User Account";

  const handleClose = () => {
    setIsModalOpen(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("email"); 
    localStorage.removeItem("role"); 
    window.location.href = "/"; // Redirect to the root route
  };


  // Function to handle editing a user
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true); // Open the modal
  };

  // Function to handle saving the edited data
  const handleSave = (e) => {
    e.preventDefault(); // Prevent form submission

    const updatedData = userData.map((user) =>
      user._id === editingUser._id ? editingUser : user
    );
    setUserData(updatedData); // Update user data

    setEditMessage("Data saved successfully!"); // Show success message
    setIsModalOpen(false); // Close modal

    setTimeout(() => {
      setEditMessage(""); // Clear the success message after a short delay
    }, 2000);
  };

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
        {selectedOption === "Overview" && (
          <header className="header2">
            <h1>Welcome, {isAdmin ? "Admin" : "User"}</h1> {/* Welcome message */}
          </header>
        )}

        {/* Graphs */}
        {selectedOption === "Overview" && (
          <div className="graphs" style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
            <div className="graph-container" style={{ width: "48%" }}>
              <h2>User Engagement vs Webpage Reach</h2>
              <Chart
                options={{
                  chart: { id: "user-engagement" },
                  xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May"] },
                }}
                series={[
                  { name: "User Engagement", data: userEngagementData },
                  { name: "Webpage Reach", data: webpageReachData },
                ]}
                type="line"
                width="100%"
                height="300"
              />
            </div>

            <div className="pie-chart-container" style={{ width: "48%" }}>
              <h2>Feature Usage Distribution</h2>
              <Chart
                options={{
                  chart: { id: "feature-usage" },
                  labels: ["Chatbot", "Chatbot with Map Integration", "UK Data Overlay"],
                }}
                series={[15, 65, 20]}
                type="pie"
                width="100%" // Full width within its container
                height="300" // Fixed height
              />
            </div>
          </div>
        )}

        {/* User Data Table */}
        {selectedOption === "User Data" && (
          <div className={styles["user-data-table"]}>
            <h2>User Data</h2>
            <table className={styles["user-table"]}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {/* Ensure userData is not undefined and is an array */}
                {Array.isArray(userData) && userData.length > 0 ? (
                  userData.map((user, index) => (
                    <tr key={user._id || index}> {/* Use user._id or index as a key */}
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user._id}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3">No user data available</td></tr> // Handle case when userData is empty
                )}
              </tbody>
            </table>
          </div>
        )}


        {selectedOption === "CRUD" && (
          <div className={styles["user-data-table"]}>
            <h2>CRUD Operation in User Data</h2>
            <table className={styles["user-table"]}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>ID</th>
                  <th>Actions</th> {/* Add Actions column for editing */}
                </tr>
              </thead>

              <tbody>
                {Array.isArray(userData) && userData.length > 0 ? (
                  userData.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user._id}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(user)}
                          className="edit-btn"
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            borderRadius: '5px',
                            fontSize: '14px',
                            transition: 'background-color 0.3s ease',
                            width: '80px',
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#0867cd'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                        >

                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="delete-btn"
                          style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            borderRadius: '5px',
                            fontSize: '14px',
                            marginLeft: '10px',
                            transition: 'background-color 0.3s ease',
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#e53935'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
                        >

                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">No user data available</td></tr>
                )}
              </tbody>



            </table>
          </div>
        )}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.6)", // Dark overlay
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            {/* Modal */}
            <div
              style={{
                backgroundColor: "white", // White background for modal content
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
                maxWidth: "100%",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Box shadow
                position: "relative", // Needed for positioning the close button
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: "slideUp 0.3s ease-out",
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "#888",
                  cursor: "pointer",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ff4d4d")}
                onMouseLeave={(e) => (e.target.style.color = "#888")}
              >
                &times; {/* Close Icon */}
              </button>

              <h2 style={{ fontSize: "22px", marginBottom: "20px", color: "#333" }}>
                Edit User
              </h2>

              {/* Form */}
              <form onSubmit={handleSave} style={{ width: "100%" }}>
                <div style={{ marginBottom: "15px", width: "100%" }}>
                  <label
                    style={{
                      fontSize: "14px",
                      marginBottom: "5px",
                      color: "#555",
                      display: "block",
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      fontSize: "16px",
                      color: "#333",
                      backgroundColor: "#f9f9f9",
                      transition: "border-color 0.3s",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px", width: "100%" }}>
                  <label
                    style={{
                      fontSize: "14px",
                      marginBottom: "5px",
                      color: "#555",
                      display: "block",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      fontSize: "16px",
                      color: "#333",
                      backgroundColor: "#f9f9f9",
                      transition: "border-color 0.3s",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                    backgroundColor: "#28a745",
                    color: "white",
                    transition: "background-color 0.3s",
                  }}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
                maxWidth: "100%",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
              }}
            >
              <h3>Do you want to delete this user permanently?</h3>
              <p>
                {userToDelete && `${userToDelete.name} (${userToDelete.email})`}
              </p>

              {/* Modal Buttons */}
              <div>
                <button
                  onClick={handleConfirmDelete}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={handleCloseDeleteModal}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Success Message */}
        {editMessage && <div className="edit-message">{editMessage}</div>}

      </div>
    </div>
  );
};

export default SubscriptionPage;
