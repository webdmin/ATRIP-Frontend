import React, { useState, useRef, useEffect } from 'react';
// import Map, { Marker, Source, Layer } from 'react-map-gl';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import axios from 'axios';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Set up Mapbox Directions service
const directionsClient = MapboxDirections({
  accessToken: 'pk.eyJ1Ijoia2F2aWt1bWFyYW4iLCJhIjoiY2xqcmRlbDJ0MDA4eTNzbnV3Z2Z0YW9pZyJ9.p4QVPDyldRLRS1yCUIH0-Q'
});

const redMarker = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/ff0000/marker.png', // Example red marker icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MapWithRoutesAndChatbot = () => {
  const [routes, setRoutes] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [ setReportResponses] = useState({});
  const messageEndRef = useRef(null);
  const [geoJsonVisible, setGeoJsonVisible] = useState(false);
  const [geojsonData, setGeojsonData] = useState(null);

  const toggleGeoJson = () => {
    setGeoJsonVisible((prev) => !prev);
  };


  const getCoordinates = async (location) => {
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=pk.eyJ1Ijoia2F2aWt1bWFyYW4iLCJhIjoiY2xqcmRlbDJ0MDA4eTNzbnV3Z2Z0YW9pZyJ9.p4QVPDyldRLRS1yCUIH0-Q`;
    try {
      const response = await axios.get(geocodingUrl);
      const coordinates = response.data.features[0].center;
      return { lon: coordinates[0], lat: coordinates[1] };
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };
  const roadMap = {};

  const fetchRoutes = async (origin, destination) => {
    const profiles = ['driving', 'cycling', 'walking']; // Add profiles based on vehicles you want to support
    const allRoutes = [];

    try {
      const originCoords = await getCoordinates(origin);
      const destinationCoords = await getCoordinates(destination);

      if (originCoords && destinationCoords) {
        setOriginCoords(originCoords);
        setDestinationCoords(destinationCoords);

        // Fetch routes for each profile
        for (const profile of profiles) {
          const response = await directionsClient.getDirections({
            profile,
            waypoints: [
              { coordinates: [originCoords.lon, originCoords.lat] },
              { coordinates: [destinationCoords.lon, destinationCoords.lat] }
            ],
            alternatives: true,
            geometries: 'geojson',
            overview: 'full',
            steps: true,
          }).send();

          const fetchedRoutes = response.body.routes;

          // Add vehicle information to each route
          fetchedRoutes.forEach(route => {
            allRoutes.push({
              coordinates: route.geometry.coordinates,
              color: getRandomColor(), // Random color function
              vehicles: [profile] // Store the vehicle type for this route
            });
          });
        }

        // Sort and limit routes
        const sortedRoutes = allRoutes.sort((a, b) => a.duration - b.duration).slice(0, 5); // Limit to 5 routes
        setRoutes(sortedRoutes);

        setChatHistory(prevChatHistory => [
          ...prevChatHistory,
          { type: 'bot', text: `Fetched ${sortedRoutes.length} routes for ${origin} to ${destination}` }
        ]);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };



  const fetchMLResponse = async (query) => {
    const typingMessage = { type: 'bot', text: '...' };
    setChatHistory(prevChatHistory => [...prevChatHistory, typingMessage]);

    try {
      const response = await fetch('https://b43e-34-147-38-131.ngrok-free.app/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const text = await response.text();
      const reportResponse = await fetch('https://b43e-34-147-38-131.ngrok-free.app/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      });

      const reportData = await reportResponse.json();
      const reportResult = reportData.result.trim().toLowerCase();
      console.log('Report response:', reportResult);

      // Check if the report result is "yes" or "no"
      const roadNameRegex = /b4151/i; // Adjust regex to capture the relevant road name from the query
      const match = query.match(roadNameRegex);
      if (match) {
        const roadName = match[0].toLowerCase();
        const routeIndex = roadMap[roadName];

        // Update color based on report response
        if (routeIndex !== undefined) {
          setReportResponses(prevResponses => ({
            ...prevResponses,
            [`route_${routeIndex}`]: reportResult === 'yes' ? 'green' : 'red'
          }));
        }
      }

      const fullResponse = `${text}`;
      startTypingEffect(fullResponse);
    } catch (error) {
      console.error('Error fetching response from chatbot API:', error);
      setChatHistory(prevChatHistory => [
        ...prevChatHistory.slice(0, -1),
        { type: 'bot', text: 'Sorry, I could not get a response at this time.' }
      ]);
    }
  };

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/data/Department_For_Transport___UK_Car_Parks.geojson');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };

    fetchGeoJSON();
  }, []);

  const startTypingEffect = (message) => {
    const typingDuration = 50;
    let index = 0;
    const messageLength = message.length;

    const typingInterval = setInterval(() => {
      if (index < messageLength) {
        setChatHistory(prevChatHistory => [
          ...prevChatHistory.slice(0, -1),
          { type: 'bot', text: message.slice(0, index + 1) }
        ]);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingDuration);
  };

  const handleChatSubmit = async (message) => {
    const locationRegex = /^(.+?)\s+to\s+(.+)$/i;
    const streetRegex = /^[A-Za-z0-9\s,]+$/; // Basic regex for street names

    if (locationRegex.test(message)) {
      const match = message.match(locationRegex);
      const origin = match[1].trim();
      const destination = match[2].trim();

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'user', text: message }
      ]);

      fetchRoutes(origin, destination);
    } else if (streetRegex.test(message)) {
      // New logic for street name
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'user', text: message }
      ]);
      highlightStreet(message);
    }


    else {
      // Handle non-address queries (as you already do)
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'user', text: message }
      ]);

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'bot', text: 'Processing your request...' }
      ]);

      const mlResponse = await fetchMLResponse(message);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'bot', text: mlResponse }
      ]);
    }

    setCurrentMessage('');
  };


  const highlightStreet = async (streetName) => {
    try {
      const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(streetName)}.json?access_token=pk.eyJ1Ijoia2F2aWt1bWFyYW4iLCJhIjoiY2xqcmRlbDJ0MDA4eTNzbnV3Z2Z0YW9pZyJ9.p4QVPDyldRLRS1yCUIH0-Q`;
      const response = await axios.get(geocodingUrl);

      if (response.data.features.length > 0) {
        const geometry = response.data.features[0].geometry;

        // Check if the geometry and coordinates are present
        if (geometry && geometry.coordinates) {
          let coordinates = geometry.coordinates;

          // Handle different types of geometries
          if (geometry.type === "LineString") {
            // For LineString, directly use the coordinates
            coordinates = coordinates.map(coord => [coord[1], coord[0]]); // Convert to [lat, lon]
          } else if (geometry.type === "Polygon") {
            // For Polygon, we need to extract the outer ring (first element)
            coordinates = coordinates[0].map(coord => [coord[1], coord[0]]);
          } else if (geometry.type === "Point") {
            // For Point, just create a single coordinate array
            coordinates = [[coordinates[1], coordinates[0]]]; // Convert to [lat, lon]
          } else {
            // Handle unsupported geometry types
            setChatHistory((prevChatHistory) => [
              ...prevChatHistory,
              { type: 'bot', text: `Unsupported geometry type: ${geometry.type}.` }
            ]);
            return;
          }

          // Highlight the street on the map
          setRoutes((prevRoutes) => [
            ...prevRoutes,
            {
              coordinates: coordinates,
              color: 'yellow', // Set the color to yellow for highlighting
              vehicles: ['Street Highlight']
            }
          ]);

          setChatHistory((prevChatHistory) => [
            ...prevChatHistory,
            { type: 'bot', text: `Highlighting ${streetName} on the map.` }
          ]);
        } else {
          setChatHistory((prevChatHistory) => [
            ...prevChatHistory,
            { type: 'bot', text: `No valid coordinates found for ${streetName}.` }
          ]);
        }
      } else {
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { type: 'bot', text: `No results found for ${streetName}.` }
        ]);
      }
    } catch (error) {
      console.error('Error fetching street:', error.response ? error.response.data : error.message);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'bot', text: 'Sorry, I could not fetch the street information.' }
      ]);
    }
  };



  const handleTextareaChange = (e) => {
    const inputValue = e.target.value;

    const words = inputValue.split(' ');
    const formattedWords = words.map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      } else if (words[index - 1].toLowerCase() === 'to') {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    });

    const formattedMessage = formattedWords.join(' ');
    setCurrentMessage(formattedMessage);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const fetchRouteDetails = async (route) => {
    try {
      const response = await directionsClient.getDirections({
        profile: route.vehicles[0], // Use the first vehicle type
        waypoints: [
          { coordinates: [originCoords.lon, originCoords.lat] },
          { coordinates: [destinationCoords.lon, destinationCoords.lat] }
        ],
        geometries: 'geojson',
        overview: 'full',
        steps: true,
      }).send();

      const routeDetails = response.body.routes[0]; // Get the first route

      const details = {
        origin: `${originCoords.lat}, ${originCoords.lon}`, // Use your actual origin name
        destination: `${destinationCoords.lat}, ${destinationCoords.lon}`, // Use your actual destination name
        distance: `${(routeDetails.distance / 1000).toFixed(1)} km`, // Convert to km
        duration: `${Math.floor(routeDetails.duration / 3600)} hours ${Math.floor((routeDetails.duration % 3600) / 60)} mins`,
        roadInfo: routeDetails.legs[0].steps.map(step => ({
          instruction: step.maneuver.instruction,
          roundabouts: step.maneuver.type === 'roundabout',
          lanes: step.lanes ? step.lanes.map(lane => lane.description).join(', ') : 'N/A', // Lane details
          speedLimit: step.speed_limit || 'N/A' // Speed limit, if available
        }))
      };

      console.log(details); // Log the details

      // Send the details to the ML API
      const mlApiUrl = 'https://7611-35-231-172-25.ngrok-free.app/test'; // Replace with your ML API endpoint

      const mlResponse = await fetch(mlApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      if (!mlResponse.ok) {
        throw new Error('Failed to send details to ML API');
      }

      const mlResponseData = await mlResponse.json();
      console.log('Response from ML API:', mlResponseData); // Log the response from ML API
    } catch (error) {
      console.error('Error fetching route details:', error);
    }
  };


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Map section (75%) */}
      <div style={{ flex: '0 0 75%', height: '100vh', zIndex: 0 }}>
        <MapContainer center={[52.5853, -1.9848]} zoom={12} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" // Ordnance Survey tile layer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {routes.length > 0 && routes.map((route, idx) => {
            if (!route.coordinates || route.coordinates.length === 0) return null; // Ensure coordinates exist

            return (
              <Polyline
                key={idx}
                positions={route.coordinates.map(coord => [coord[1], coord[0]])}
                color={route.color}
                pathOptions={{ weight: 5 }} // Width of the polyline
                eventHandlers={{
                  mouseover: (e) => {
                    const vehicleList = route.vehicles && route.vehicles.length > 0
                      ? route.vehicles.join(', ')
                      : 'No vehicles available'; // Default message if no vehicles

                    const popupContent = `
            <div>
              <strong>Vehicle:</strong> ${vehicleList}
            </div>
          `;
                    L.popup()
                      .setLatLng(e.latlng)
                      .setContent(popupContent)
                      .openOn(e.target._map);
                  },
                  mouseout: (e) => {
                    e.target._map.closePopup();
                  },
                  click: () => {
                    // Call the fetchRouteDetails function when the route is clicked
                    fetchRouteDetails(route);
                  }
                }}
              />
            );
          })}

          {originCoords && (
            <Marker position={[originCoords.lat, originCoords.lon]} icon={redMarker}>
              <Popup>Origin</Popup>
            </Marker>
          )}
          {destinationCoords && (
            <Marker position={[destinationCoords.lat, destinationCoords.lon]} icon={redMarker}>
              <Popup>Destination</Popup>
            </Marker>
          )}

          {geoJsonVisible && geojsonData && geojsonData.features && geojsonData.features.map((feature, idx) => {
            // Check if feature and geometry exist and are of type 'Point'
            if (feature && feature.geometry && feature.geometry.type === 'Point') {
              const [lon, lat] = feature.geometry.coordinates;
              return (
                <CircleMarker
                  key={idx}
                  center={[lat, lon]}
                  radius={8}
                  fillColor="red"
                  color="red"
                  fillOpacity={1}
                >
                  <Popup>{feature.properties.name || 'Parking Spot'}</Popup>
                </CircleMarker>
              );
            }
            return null; // Return null for any feature that doesn't meet criteria
          })}

          {/* Button to toggle GeoJSON visibility */}
          <button onClick={toggleGeoJson} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, borderRadius: '60px', padding: '0px 0px 0px 0px', borderColor: 'none' }}>
            <img src="https://cdn-icons-png.flaticon.com/128/9412/9412322.png" alt="Parking" style={{ width: '48px', height: '45px', padding: '0px 0px 0px 0px', position: 'relative', top: '1.2px' }} />
          </button>
        </MapContainer>
      </div>

      {/* Chatbot section (25%) */}
      <div style={{
        flex: '0 0 25%',
        background: 'linear-gradient(to right bottom,rgb(126 179 116), rgb(126 179 116))',
        padding: '20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8), -5px 0 10px rgba(0, 0, 0, 0.2), 5px 0 10px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        zIndex: 10,
      }}>
        <h1 style={{
          textAlign: 'center',
          margin: '0',
          background: 'white',
          borderRadius: '10px',
          padding: '10px 0',
          color: 'black',
          fontFamily: 'sans-serif',
          fontWeight: 'bolder'
        }}>
          <b>ATRIP</b>
        </h1>
        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>
          <h3 style={{ color: 'black' }}>Active Travel Resilient Infrastructure Planner</h3>
        </div>
        <div style={{
          marginBottom: '20px',
          maxHeight: 'calc(100% - 140px)', // Adjust this value based on the height of other elements
          overflowY: 'auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          padding: '10px',
        }}>
          {chatHistory.map((msg, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}>
              <div style={{
                background: msg.type === 'user' ? '#007bff' : '#fff',
                color: msg.type === 'user' ? '#fff' : '#000',
                padding: '10px',
                borderRadius: '8px',
                maxWidth: '60%',
                wordBreak: 'break-word',
                boxShadow: msg.type === 'user'
                  ? '0px 6px 8px rgba(0, 0, 0, 0.2)'
                  : '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow for bot messages as well
                border: msg.type === 'bot' ? '1px solid #ccc' : 'none'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messageEndRef} /> {/* Scroll anchor */}
        </div>
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '10px',
          position: 'relative',
        }}>
          <textarea
            id="message-input"
            rows="3"
            placeholder="Ask your questions here"
            value={currentMessage}
            onChange={handleTextareaChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChatSubmit(currentMessage);
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={() => handleChatSubmit(currentMessage)}
            style={{
              marginTop: '10px',
              padding: '10px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
};

export default MapWithRoutesAndChatbot;
