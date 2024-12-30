import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate
import './Document.css'; // Ensure you have the proper CSS file if needed

const Document = () => {
    const navigate = useNavigate(); // Use navigate hook for redirection
    const [showTimerPopup, setShowTimerPopup] = useState(false);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        number: '',
        country: ''
    });

    useEffect(() => {
        // Commenting out the check temporarily for testing purposes
        // if (localStorage.getItem('popupDismissed') === 'true') {
        //     console.log('Popup already dismissed');
        //     return; // Exit early if popup has been dismissed
        // }

        // Start a timer to show the popup after 5 seconds
        const timer = setTimeout(() => {
            setShowTimerPopup(true);
            console.log('Popup should be shown now');
        }, 5000);

        return () => {
            clearTimeout(timer); // Cleanup the timer on component unmount
        };
    }, []);






    const handleYesClick = () => {
        setShowTimerPopup(false);
        setShowDetailsPopup(true);
    };

    const handleNoClick = () => {
        setShowTimerPopup(false); // Hide the popup
        localStorage.setItem('popupDismissed', 'true'); // Mark the popup as dismissed
        console.log('Popup dismissed and state saved');

        // Clear localStorage for debugging (optional, remove later)
        // localStorage.removeItem('popupDismissed');
    };





    const handleCancelDetailsPopup = () => {
        setShowDetailsPopup(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmitDetails = () => {
        // Handle form submission, could include form validation
        setShowDetailsPopup(false);
        setShowSuccessPopup(true);

        // Redirect to homepage after 3 seconds
        setTimeout(() => {
            navigate('/'); // Using navigate to go to the homepage
        }, 3000);
    };

    const styles = {
        container: {
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f4f4f9',
            color: '#333',
            lineHeight: '1.6',
        },
        heading: {
            textAlign: 'center',
            fontSize: '48px',
            marginBottom: '20px',
            color: '#222',
        },
        section: {
            marginBottom: '40px',
        },
        subheading: {
            fontSize: '32px',
            marginBottom: '15px',
            color: '#0056b3',
        },
        paragraph: {
            fontSize: '18px',
            marginBottom: '15px',
            color: '#555',
        },
        list: {
            listStyleType: 'disc',
            marginLeft: '20px',
        },
        listItem: {
            fontSize: '18px',
            marginBottom: '10px',
        },
        codeBlock: {
            backgroundColor: '#333',
            color: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            fontSize: '16px',
            overflowX: 'auto',
            marginTop: '20px',
        },
        buttonContainer: {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: '1000',
        },
        bookDemoButton: {
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '15px 30px',
            fontSize: '18px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
        },

    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>ATRIP Project Documentation</h1>

            <section style={styles.section}>
                <h2 style={styles.subheading}>Introduction</h2>
                <p style={styles.paragraph}>
                    "A Trip" is a machine learning project designed to determine the feasibility of constructing a cycle path on a given road. With urbanization and the push for sustainable transportation, cycling infrastructure has become crucial for city planning. This project leverages data-driven decision-making
                    to recommend whether a cycle path can be laid on a particular road, based on various factors and guidelines. By training a classification model, "A Trip" aims to assist city planners and policymakers in enhancing urban mobility and safety for cyclists.
                </p>

            </section>

            <section style={styles.section}>
                <h2 style={styles.subheading}>Project Summary</h2>
                <p style={styles.paragraph}>
                    A UK study stated that millions of pounds (Active Travel England launches, 2022) are being poured into developing active travel infrastructure (ATI) in the UK, however, there is still a need to embrace technology and use data-based solutions to inform decision-making and improve sustainability. Our solution is an AI-based tool, ATRIP (Active Travel Resilient Infrastructure Planner), which aids town planners in designing an ATI plan with reduced time and effort. ATRIP will recommend a fully developable ATI plan along with the other required optional infrastructures (cycle parking, mobility hub). ATRIP is designed using a one-of-its-kind hybrid deep learning and geographical Information System (GIS) model and a data sharing platform, capable of visualising and querying an ocean of unstructured data, of development plans of town, transport, and utilities and analysing traffic data, air pollution, weather effect prone area, population density, etc. and intelligently propose new ATI routes. Aston University and Walsall City Council are our collaborators, in piloting this project. The proposed solution, for this grant, will be to build a data sharing platform (7 WMCA Councils) relating to active travel plans and develop an ATRIP beta version, to test for Walsall council that will propose possible active travel infrastructure route(s) to Aldridge station from within surrounding areas.
                </p>

            </section>

            <section style={styles.section}>
                <h2 style={styles.subheading}>Data Collection </h2>
                <p style={styles.paragraph}>
                    The data for this project is collected from various sources, ensuring a comprehensive understanding of the road conditions and other influencing factors.

                    The dataset includes the following features:
                </p>
                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        <strong>Road Details (Road Width):</strong> Acceptable Lane width of the road (Desirable and min) with traffic lane.
                    </li>
                    <li style={styles.listItem}>
                        <strong>Overtaking clearance-Speed Limit:</strong> The maximum legal speed for vehicles on the road.
                    </li>
                    <li style={styles.listItem}>
                        <strong>Motor Traffic Flow with speed limit:</strong>  The volume of motor vehicle traffic, typically measured in vehicles per hour.
                    </li>
                    <li style={styles.listItem}>
                        <strong>Deprivation:</strong> Socioeconomic data of the area, indicating levels of deprivation.
                    </li>
                    <li style={styles.listItem}>
                        <strong>Cycle Flow: </strong>The volume of cyclists using the road, peak hour cycle flow with one way direction and 2-way direction.
                    </li>
                    <li style={styles.listItem}>
                        <strong>Carriage Way Width -lanes:</strong>  The width of the carriageway excluding footpaths and verges.


                    </li>
                </ul>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subheading}>Code Example</h2>
                <p style={styles.paragraph}>
                    Here's an example of how you can create a task using ATRIP's API:
                </p>
                <pre style={styles.codeBlock}>
                    {`const createTask = async (taskData) => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
  }
};`}
                </pre>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subheading}>Advanced Features</h2>
                <p style={styles.paragraph}>
                    ATRIP includes several advanced features for users who need extra customization and functionality. These include:
                </p>
                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        <strong>Automated Workflows:</strong> Streamline repetitive tasks with automation.
                    </li>
                    <li style={styles.listItem}>
                        <strong>Third-Party Integrations:</strong> Integrate with popular tools like Slack, Google Drive, and Trello.
                    </li>
                    <li style={styles.listItem}>
                        <strong>Custom Reporting:</strong> Tailor reports to your needs and get detailed insights.
                    </li>
                </ul>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subheading}>Conclusion</h2>
                <p style={styles.paragraph}>
                    The ATRIP project serves as a significant step towards fostering sustainable transportation and reducing environmental impact. By integrating cutting-edge technologies like Leaflet.js, TopoJSON, and GeoJSON, the project provides a user-friendly platform to promote cycling and pedestrian routes in Birmingham.

                    This initiative not only encourages eco-friendly travel but also empowers users with accessible and accurate route suggestions tailored to their needs. With interactive mapping and zoomable layers, ATRIP bridges the gap between technology and sustainability, paving the way for a greener and healthier urban environment.

                    By addressing pollution and advocating for reduced dependency on petrol vehicles, ATRIP underscores our commitment to environmental preservation and urban mobility innovation.
                </p>

            </section>

            {/* Sticky "Book a Demo" Button */}
            <div style={styles.buttonContainer}>
                <button
                    style={styles.bookDemoButton}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0056b3';
                        e.target.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                        e.target.style.transform = 'translateY(0)';
                    }}
                >
                    Book a Demo
                </button>
            </div>


            {showTimerPopup && (
                <div style={popupStyles.popupContainer}>
                    <div style={popupStyles.popupContent}>
                        <h2>Interesting?</h2>
                        <p style={popupStyles.connectMessage}>Connect with our team to experience our Products</p>

                        <div style={popupStyles.buttonContainer}>
                            <button style={popupStyles.yesButton} onClick={handleYesClick}>Yes</button>
                            <button style={popupStyles.noButton} onClick={handleNoClick}>No</button>
                        </div>

                        <button style={popupStyles.closeButton} onClick={handleNoClick}>X</button>
                    </div>
                </div>
            )}



            {showDetailsPopup && (
                <div style={popupStyles.popupContainer}>
                    <div style={{ ...popupStyles.detailsPopupContent, backgroundColor: 'white' }}>
                        {/* Left half with the form */}
                        <div style={popupStyles.leftHalf}>
                            <h3 style={popupStyles.formTitle}>Enter Your Details</h3>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={userDetails.firstName}
                                    placeholder="First Name"
                                    onChange={handleInputChange}
                                    style={popupStyles.inputField}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={userDetails.lastName}
                                    placeholder="Last Name"
                                    onChange={handleInputChange}
                                    style={popupStyles.inputField}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={userDetails.email}
                                    placeholder="Email"
                                    onChange={handleInputChange}
                                    style={popupStyles.inputField}
                                />
                                <input
                                    type="tel"
                                    name="number"
                                    value={userDetails.number}
                                    placeholder="Phone Number"
                                    onChange={handleInputChange}
                                    style={popupStyles.inputField}
                                />
                                <input
                                    type="text"
                                    name="country"
                                    value={userDetails.country}
                                    placeholder="Country"
                                    onChange={handleInputChange}
                                    style={popupStyles.inputField}
                                />
                                <button onClick={handleSubmitDetails} style={popupStyles.submitButton}>Submit</button>
                            </form>
                        </div>
                    </div>
                    <button style={popupStyles.closeButton} onClick={handleCancelDetailsPopup}>X</button>
                </div>
            )}




            {/* Success Popup */}
            {showSuccessPopup && (
                <div style={popupStyles.popupContainer}>
                    <div style={popupStyles.successPopupContent}>
                        <h3>Successfully booked your demo!</h3>
                        <p>Our team will contact you as soon as possible.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const popupStyles = {
    popupContainer: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '9999',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background overlay
    },
    popupContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        position: 'relative',
        textAlign: 'center',
        minWidth: '300px',
        maxWidth: '500px',
    },
    buttonContainer: {
        marginTop: '20px',
    },
    yesButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px',
    },
    noButton: {
        backgroundColor: '#ccc',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'transparent',
        border: 'none',
        fontSize: '24px',
        color: '#000',
        cursor: 'pointer',
    },
    detailsPopupContent: {
        display: 'flex',
        maxWidth: '600px',  // Adjusted for a more compact form
        width: '100%',
        backgroundColor: 'white',  // White background for the popup content
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
    },
    leftHalf: {
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    rightHalf: {
        flex: '1',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '8px',
    },
    formTitle: {
        fontSize: '24px',
        marginBottom: '20px',
        fontWeight: 'bold',
    },
    inputField: {
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px',
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    slideshowContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    slide: {
        marginBottom: '20px',
        opacity: 0,
        animation: 'fadeIn 2s forwards',
    },
    slideImage: {
        maxWidth: '100%',
        borderRadius: '8px',
    },
    successPopupContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
    },
    connectMessage: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    }
};

export default Document;
