
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
  //const [setReportResponses] = useState({});
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
  //const roadMap = {};

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
      const response = await fetch('https://atripchatbot-adcyetdea4djaqbh.centralindia-01.azurewebsites.net/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }), // Ensure 'query' is defined
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      // Parse the JSON response
      const data = await response.json();

      // Log the entire response to understand its structure
      console.log('Full Response:', data);

      // Safely access the 'text' property, and check for undefined or empty text
      let responseText = data && data.response ? data.response : 'No valid response received';
      console.log('Response Text:', responseText); // Debug log

      // Remove asterisks (*) from the response text
      responseText = responseText.replace(/\*/g, '');  // Remove all asterisks

      // Replace <br /> tags with newline characters
      responseText = responseText.replace(/<br\s*\/?>/g, '\n');  // Replace <br /> with \n

      // Ensure the response has proper spacing between paragraphs (add extra newline)
      responseText = responseText.replace(/\n\n+/g, '\n\n'); // Limit multiple newlines to just 2

      // Add the bot's response to chat history
      setChatHistory(prevChatHistory => [
        ...prevChatHistory.slice(0, -1), // Remove typing indicator
        { type: 'bot', text: responseText }, // Add the bot's response as a message bubble
      ]);
    } catch (error) {
      console.error('Error fetching response from chatbot API:', error);
      setChatHistory(prevChatHistory => [
        ...prevChatHistory.slice(0, -1),
        { type: 'bot', text: 'Sorry, I could not get a response at this time.' },
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

  // const startTypingEffect = (message) => {
  //   const typingDuration = 50;
  //   let index = 0;
  //   const messageLength = message.length;

  //   const typingInterval = setInterval(() => {
  //     if (index < messageLength) {
  //       setChatHistory(prevChatHistory => [
  //         ...prevChatHistory.slice(0, -1),
  //         { type: 'bot', text: message.slice(0, index + 1) }
  //       ]);
  //       index++;
  //     } else {
  //       clearInterval(typingInterval);
  //     }
  //   }, typingDuration);
  // };

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
            { type: 'bot', text: `Please enter the correct location name without spaces on the map!` }
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

  const getDirectionsRoute = async (origin, destination) => {
    try {
      // Log the origin and destination to ensure they are correct
      // console.log("Fetching routes for origin:", origin, "and destination:", destination);

      // Make the API call to fetch directions between origin and destination
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&steps=true&annotations=maxspeed,congestion&overview=full&access_token=pk.eyJ1Ijoia2F2aWt1bWFyYW4iLCJhIjoiY2xqcmRlbDJ0MDA4eTNzbnV3Z2Z0YW9pZyJ9.p4QVPDyldRLRS1yCUIH0-Q`
      );

      if (!response.ok) {
        throw new Error('Directions API request failed');
      }

      const data = await response.json();
      if (!data.routes || !data.routes.length) {
        throw new Error('No routes found');
      }

      // Return all the routes available in the response
      return data.routes;
    } catch (error) {
      console.error('Directions error:', error);
      throw new Error('Failed to get route directions');
    }
  };


  const processRouteData = async (route) => {
    const roadRefs = {
      motorways: new Set(),
      aRoads: new Set(),
      bRoads: new Set(),
    };

    for (const step of route.legs[0].steps) {
      // Extract road references from the instruction and name
      const refs = extractRoadRefs(step.maneuver.instruction);
      const nameRefs = extractRoadRefs(step.name || '');

      // Combine the refs
      Object.keys(refs).forEach((type) => {
        refs[type].forEach((ref) => roadRefs[type].add(ref));
        nameRefs[type].forEach((ref) => roadRefs[type].add(ref));
      });
    }

    return {
      motorways: Array.from(roadRefs.motorways),
      aRoads: Array.from(roadRefs.aRoads),
      bRoads: Array.from(roadRefs.bRoads),
    };
  };


  const extractRoadRefs = (instruction) => {
    const refs = {
      motorways: new Set(),
      aRoads: new Set(),
      bRoads: new Set(),
    };

    const patterns = {
      motorway: /\b[M][0-9]+\b/g,
      aRoad: /\b[A][0-9]+\b/g,
      bRoad: /\b[B][0-9]+\b/g,
    };

    const motorwayMatches = instruction.match(patterns.motorway) || [];
    const aRoadMatches = instruction.match(patterns.aRoad) || [];
    const bRoadMatches = instruction.match(patterns.bRoad) || [];

    motorwayMatches.forEach((ref) => refs.motorways.add(ref));
    aRoadMatches.forEach((ref) => refs.aRoads.add(ref));
    bRoadMatches.forEach((ref) => refs.bRoads.add(ref));

    return refs;
  };



  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Map section (75%) */}
      <div style={{ flex: '0 0 75%', height: '100vh', zIndex: 0 }}>
        <MapContainer center={[52.5853, -1.9848]} zoom={12} style={{ width: '100%', height: '100%' }}>
          {/* Map setup */}
          <TileLayer
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" // Ordnance Survey tile layer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {routes.length > 0 &&
            routes.map((route, idx) => {
              if (!route.coordinates || route.coordinates.length === 0) return null; // Ensure coordinates exist

              return (
                <Polyline
                  key={idx}
                  positions={route.coordinates.map((coord) => [coord[1], coord[0]])}
                  color={route.color}
                  pathOptions={{ weight: 5 }} // Width of the polyline
                  eventHandlers={{
                    mouseover: (e) => {
                      const vehicleList =
                        route.vehicles && route.vehicles.length > 0
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

                    click: async (e) => {
                      const clickedRouteLayer = e.target; // This should be the polyline layer

                      if (clickedRouteLayer instanceof L.Polyline) {
                        // If there was a previously clicked route, reset its style
                        if (window.lastClickedRouteLayer) {
                          window.lastClickedRouteLayer.setStyle({
                            weight: 7,
                            color: '#808080',
                            opacity: 1,
                          });
                        }

                        // Ensure you have a map instance reference
                        const map = e.target._map; // Get map from the clicked polyline

                        if (map) {
                          // Remove the clicked route from the map temporarily
                          clickedRouteLayer.remove();

                          // Apply the highlight styling
                          clickedRouteLayer.setStyle({
                            weight: 9,
                            color: '#006DFF',
                            opacity: 1,
                          });

                          // Re-add the clicked route layer to the map
                          map.addLayer(clickedRouteLayer);

                          // Save the reference of the newly clicked route
                          window.lastClickedRouteLayer = clickedRouteLayer;
                        } else {
                          console.error("Map is not found.");
                        }

                        // Your additional logic for handling the route data goes here...
                      } else {
                        console.error('Clicked element is not a valid route.');
                      }

                      try {
                        // Get the route's coordinates (lat, lng) from the polyline (convert to [lng, lat] format)
                        const routeCoordinates = clickedRouteLayer.getLatLngs();
                        const origin = [routeCoordinates[0].lng, routeCoordinates[0].lat];  // [lng, lat] format
                        const destination = [
                          routeCoordinates[routeCoordinates.length - 1].lng,
                          routeCoordinates[routeCoordinates.length - 1].lat,
                        ]; // [lng, lat] format

                        // Fetch all available routes between origin and destination
                        const routes = await getDirectionsRoute(origin, destination);

                        // Debugging: log the coordinates of all fetched routes and the clicked polyline
                        console.log('Clicked polyline coordinates:', routeCoordinates);
                        console.log('Fetched routes coordinates:', routes.map(route => route.geometry.coordinates));

                        // Loop through all the fetched routes and attempt to match the clicked route
                        const clickedRoute = routes.find(route => {
                          // Convert the polyline coordinates to match the [lng, lat] format
                          const polylineCoordinates = routeCoordinates.map(coord => [coord.lng, coord.lat]);

                          // Log the polyline and route coordinates to debug
                          console.log('Polyline vs Fetched Route:', polylineCoordinates, route.geometry.coordinates);

                          // Allow for small tolerance when comparing coordinates (e.g., due to rounding issues)
                          const matchCoordinates = (polyCoords, routeCoords) => {
                            if (polyCoords.length !== routeCoords.length) return false;
                            for (let i = 0; i < polyCoords.length; i++) {
                              const [polyLng, polyLat] = polyCoords[i];
                              const [routeLng, routeLat] = routeCoords[i];
                              if (Math.abs(polyLng - routeLng) > 0.0001 || Math.abs(polyLat - routeLat) > 0.0001) {
                                return false;
                              }
                            }
                            return true;
                          };

                          // Return true if the coordinates match with a tolerance
                          return matchCoordinates(polylineCoordinates, route.geometry.coordinates);
                        });

                        if (!clickedRoute) {
                          console.error("Couldn't find the clicked route in the fetched routes.");
                          // Immediately update the chat history with a no data found message
                          setChatHistory(prevHistory => [
                            ...prevHistory,
                            {
                              type: 'bot',
                              text: 'Sorry, the data for the clicked route has not been found!',  // Custom error message
                            },
                          ]);
                          return; // Exit early if no clicked route is found
                        }

                        setChatHistory(prevHistory => [
                          ...prevHistory,
                          {
                            type: 'user',
                            text: "You've selected a route", // Display the route selection message first
                          },
                        ]);

                        // Process the road data specifically for this clicked route
                        const roadData = await processRouteData(clickedRoute);

                        // Prepare the data to be sent
                        const dataToSend = {
                          motorways: Array.from(roadData.motorways),  // Convert Set to Array
                          aRoads: Array.from(roadData.aRoads),        // Convert Set to Array
                          bRoads: Array.from(roadData.bRoads),        // Convert Set to Array
                          motorwaysCount: roadData.motorways.length,
                          aRoadsCount: roadData.aRoads.length,
                          bRoadsCount: roadData.bRoads.length,
                        };

                        // Log the data being sent to the API to debug
                        console.log('Sending data to ML API:', JSON.stringify(dataToSend));

                        // Check if the relevant data is empty and show a custom message
                        if (
                          dataToSend.motorways.length === 0 &&
                          dataToSend.aRoads.length === 0 &&
                          dataToSend.bRoads.length === 0
                        ) {
                          // If no data is available, send a no data found message to the chatbot
                          const noDataMessage = "Sorry, the data for the clicked route has not been found!";
                          setChatHistory(prevHistory => [
                            ...prevHistory,
                            {
                              type: 'bot',
                              text: noDataMessage, // Display no data found message
                            },
                          ]);
                        } else {
                          // Format the data into a more readable string
                          const formattedReply = `
                      Motorways: ${dataToSend.motorways.length > 0 ? dataToSend.motorways.join(', ') : 'Null'}
                      A-Roads: ${dataToSend.aRoads.length > 0 ? dataToSend.aRoads.join(', ') : 'Null'}
                      B-Roads: ${dataToSend.bRoads.length > 0 ? dataToSend.bRoads.join(', ') : 'Null'}
                      Motorways Count: ${dataToSend.motorwaysCount > 0 ? dataToSend.motorwaysCount : 'Null'}
                      A-Roads Count: ${dataToSend.aRoadsCount > 0 ? dataToSend.aRoadsCount : 'Null'}
                      B-Roads Count: ${dataToSend.bRoadsCount > 0 ? dataToSend.bRoadsCount : 'Null'}
                      `;

                          // Immediately update the chat history with the formatted response
                          setChatHistory(prevHistory => [
                            ...prevHistory,
                            {
                              type: 'bot', // The type will be 'bot' because this is a message from the bot
                              text: (
                                <span>
                                  <strong>Data of the Clicked Route:</strong> {formattedReply}
                                </span>
                              ), // The custom formatted response
                            },
                          ]);
                        }

                        // Send the data to the ML API using fetch
                        const response = await fetch('https://atripchatbot-adcyetdea4djaqbh.centralindia-01.azurewebsites.net/save-road-data', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json', // Indicate we're sending JSON
                          },
                          body: JSON.stringify(dataToSend), // Convert the data to JSON format
                        });

                        // Check if the response is successful
                        if (response.ok) {
                          const responseData = await response.json(); // Parse the response JSON
                          console.log('API Response:', responseData);  // Log the API response
                        } else {
                          console.error('Failed to send data to ML API:', response.statusText);
                          const errorResponse = await response.json();
                          console.error('Error Response:', errorResponse); // Log the detailed error response from the API
                        }
                      } catch (error) {
                        console.error('Error processing route data:', error);
                      }


                    }

                    ,
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
          {/* GeoJSON data */}
          {geoJsonVisible &&
            geojsonData &&
            geojsonData.features &&
            geojsonData.features.map((feature, idx) => {
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
              return null;
            })}

          {/* Button to toggle GeoJSON visibility */}
          <button
            onClick={toggleGeoJson}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1000,
              borderRadius: '60px',
              padding: '0px 0px 0px 0px',
              borderColor: 'none',
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/9412/9412322.png"
              alt="Parking"
              style={{
                width: '48px',
                height: '45px',
                padding: '0px 0px 0px 0px',
                position: 'relative',
                top: '1.2px',
              }}
            />
          </button>
        </MapContainer>
      </div>

      {/* Chatbot section (25%) */}
      <div
        style={{
          flex: '0 0 25%',
          background: 'linear-gradient(to right bottom, rgb(246 180 157), rgb(214 144 116))',
          padding: '20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '0px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8), -5px 0 10px rgba(0, 0, 0, 0.2), 5px 0 10px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            margin: '0',
            background: 'white',
            borderRadius: '10px',
            padding: '10px 0',
            color: 'black',
            fontFamily: 'sans-serif',
            fontWeight: 'bolder',
          }}
        >
          <b>ATRIP</b>
        </h1>
        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>
          <h3 style={{ color: 'black', fontFamily:'system-ui'}}>Active Travel Resilient Infrastructure Planner</h3>
        </div>
        <div
  style={{
    marginBottom: '20px',
    maxHeight: 'calc(100% - 140px)',
    overflowY: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '10px',
  }}
>
  {chatHistory.map((msg, index) => (
    <div
      key={index}
      style={{
        display: 'flex',
        justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: '10px',
        alignItems: 'center',  // Align items (message bubble and icon)
      }}
    >
      {msg.type === 'bot' && (
        <i className="fa fa-robot" style={{ marginRight: '10px', fontSize: '18px' }}></i> // Icon on the left for bot
      )}
      
      <div
        style={{
          background: msg.type === 'user' ? '#007bff' : '#fff',
          color: msg.type === 'user' ? '#fff' : '#000',
          padding: '10px',
          borderRadius: '8px',
          maxWidth: '60%',
          wordBreak: 'break-word',
          boxShadow: msg.type === 'user' ? '0px 6px 8px rgba(0, 0, 0, 0.2)' : '0px 4px 8px rgba(0, 0, 0, 0.2)',
          border: msg.type === 'bot' ? '1px solid #ccc' : 'none',
          fontFamily: 'system-ui',
          whiteSpace: 'pre-line', // <-- Applied here for proper text formatting
        }}
      >
        {msg.text}
      </div>

      {msg.type === 'user' && (
        <i className="fa fa-question-circle" style={{ marginLeft: '10px', fontSize: '18px' }}></i> // Icon on the right for user
      )}
    </div>
  ))}


          <div ref={messageEndRef} /> {/* Scroll anchor */}
        </div>
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: '10px',
            position: 'relative',
          }}
        >
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
              boxSizing: 'border-box',
              fontFamily:'system-ui'
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
              fontSize: '16px',
              fontFamily:'system-ui'

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
