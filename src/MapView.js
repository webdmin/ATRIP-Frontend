

import React, { useState, useRef, useEffect } from 'react';
// import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
// import { Marker } from 'react-leaflet';
// import L from 'leaflet';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2F2aWt1bWFyYW4iLCJhIjoiY2xqcmRlbDJ0MDA4eTNzbnV3Z2Z0YW9pZyJ9.p4QVPDyldRLRS1yCUIH0-Q'; // Replace with your actual access token



// Set default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

// Set up Mapbox Directions service
const directionsClient = MapboxDirections({
  accessToken: 'pk.eyJ1Ijoia2F2aWt1bWFyYW4iLCJhIjoiY2xqcmRlbDJ0MDA4eTNzbnV3Z2Z0YW9pZyJ9.p4QVPDyldRLRS1yCUIH0-Q'
});

const MapWithRoutesAndChatbot = () => {
  const [routes, setRoutes] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [reportResponses, setReportResponses] = useState({});
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const messageEndRef = useRef(null);

  useEffect(() => {
    // Initialize Mapbox map
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-1.9803, 52.5857],
        zoom: 9, // Initial zoom level
        attributionControl: false, // Disable attribution control
      });

      const nav = new mapboxgl.NavigationControl();
      mapRef.current.addControl(nav, 'top-right');
    }
  }, []);

  const getCoordinates = async (location) => {
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxgl.accessToken}`;
    try {
      const response = await axios.get(geocodingUrl);
      const coordinates = response.data.features[0].center;
      return { lon: coordinates[0], lat: coordinates[1] };
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const fetchRoutes = async (origin, destination) => {
    try {
      const originCoords = await getCoordinates(origin);
      const destinationCoords = await getCoordinates(destination);
  
      if (originCoords && destinationCoords) {
        setOriginCoords(originCoords);
        setDestinationCoords(destinationCoords);
  
        const response = await MapboxDirections({
          accessToken: mapboxgl.accessToken,
        }).getDirections({
          profile: 'driving',
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
        const sortedRoutes = fetchedRoutes.sort((a, b) => a.duration - b.duration);
        const topRoutes = sortedRoutes.map(route => route.geometry);
  
        setRoutes(topRoutes);
  
        // Clear existing routes
        mapRef.current.eachLayer((layer) => {
          if (layer.id.startsWith('route')) {
            mapRef.current.removeLayer(layer.id);
            mapRef.current.removeSource(layer.id);
          }
        });
  
        // Add routes to the map
        topRoutes.forEach((route, idx) => {
          mapRef.current.addSource(`route${idx}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: route,
            },
          });
          mapRef.current.addLayer({
            id: `route${idx}`,
            type: 'line',
            source: `route${idx}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#888',
              'line-width': 8,
            },
          });
        });
  
        // Create new markers for origin and destination
        const originMarker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([originCoords.lon, originCoords.lat])
          .addTo(mapRef.current);
  
        const destinationMarker = new mapboxgl.Marker({ color: 'blue' })
          .setLngLat([destinationCoords.lon, destinationCoords.lat])
          .addTo(mapRef.current);
  
        setChatHistory(prevChatHistory => [
          ...prevChatHistory,
          { type: 'bot', text: `Fetched the routes for ${origin} to ${destination}` }
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
      // Fetch the main response
      const response = await fetch('https://1a99-34-134-246-164.ngrok-free.app/predict', {
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

      // Fetch the report response
      const reportResponse = await fetch('https://1a99-34-134-246-164.ngrok-free.app/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      });

      const reportData = await reportResponse.json();
      const reportResult = reportData.result.trim().toLowerCase();
      console.log('Report response:', reportResult);


      // Update report responses
      setReportResponses(prevResponses => ({
        ...prevResponses,
        [query]: reportResult === 'yes' ? 'green' : 'red'
      }));

      // Prepare the full response for typing effect
      const fullResponse = `${text}`;
      // Start the typing effect with the full response
      startTypingEffect(fullResponse);

    } catch (error) {
      console.error('Error fetching response from chatbot API:', error);
      setChatHistory(prevChatHistory => [
        ...prevChatHistory.slice(0, -1),
        { type: 'bot', text: 'Sorry, I could not get a response at this time.' }
      ]);
    }
  };





  const startTypingEffect = (message) => {
    const typingDuration = 50; // Time in ms to reveal each character
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
        // After typing effect, set the complete message

      }
    }, typingDuration);
  };

  const handleChatSubmit = async (message) => {
    // Regex to strictly match "location to location" format
    const locationRegex = /^[\w\s]+ to [\w\s]+$/i; // Matches phrases like "walsall to aldridge"

    if (locationRegex.test(message)) {
      const [origin, destination] = message.split(' to ');

      // Add the user message in the chat
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'user', text: message }
      ]);

      // Add the bot reply for route fetching
      // setChatHistory((prevChatHistory) => [
      //     ...prevChatHistory,
      //     { type: 'bot', text: `Fetching the possible routes from ${origin.trim()} to ${destination.trim()}...` }
      // ]);

      // Capitalize the first letter of each location
      const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      const formattedOrigin = capitalize(origin.trim());
      const formattedDestination = capitalize(destination.trim());

      // Fetch and render routes on the map
      fetchRoutes(formattedOrigin, formattedDestination);
    } else {
      // Handle it as a general question
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'user', text: message }
      ]);

      // For other types of questions, we send the query to the ML API
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'bot', text: 'Processing your request...' }
      ]);

      const mlResponse = await fetchMLResponse(message);

      // Display ML API response in the chatbot
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'bot', text: mlResponse }
      ]);
    }

    // Scroll to the bottom
    setCurrentMessage('');
  };


  const handleTextareaChange = (e) => {
    const inputValue = e.target.value;

    // Split the input value into words
    const words = inputValue.split(' ');

    // Capitalize the first word and the word after "to"
    const formattedWords = words.map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first word
      } else if (words[index - 1].toLowerCase() === 'to') {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize word after "to"
      }
      return word.toLowerCase(); // Ensure the rest are lowercase
    });

    // Join the words back into a string
    const formattedMessage = formattedWords.join(' ');

    // Update the current message state
    setCurrentMessage(formattedMessage);
  };


  useEffect(() => {
    // Scroll to bottom when new messages are added
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

{/* Mapbox Map section (75%) */}
<div ref={mapContainerRef} style={{ flex: '0 0 75%', height: '100vh', zIndex: 1 }} />

      {/* Chatbot section (25%) */}
      <div style={{
        flex: '0 0 25%',
        background: 'linear-gradient(to right bottom, rgb(247 180 157), rgb(247 180 157))',
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
