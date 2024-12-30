import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { v4 as uuidv4 } from 'uuid';
import L from 'leaflet';
 
const walsallCoordinates = [52.5863, -1.9822];
 
const colorPalette = [
  '#660000', '#003366', '#004d00', '#800080', '#808000', '#ff6600', '#660066', '#006666', '#4d4d00', '#990000'
];
 
const UKdata = () => {
  const [containers, setContainers] = useState([]);
  const [expandedContainers, setExpandedContainers] = useState(new Set()); // Set to track expanded containers
  const [files, setFiles] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [geojsonLayers, setGeojsonLayers] = useState([]);
 
  // Fetch containers
  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blobs/containers'); // Corrected URL
        setContainers(response.data); // Store containers as an array
      } catch (error) {
        console.error('Error fetching containers', error);
      }
    };
    fetchContainers();
  }, []);
  
  // Fetch files for a selected container
  const fetchFilesForContainer = async (container) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blobs/containers/${container}/files`); // Corrected URL
      setFiles(prevFiles => ({ ...prevFiles, [container]: response.data }));
    } catch (error) {
      console.error('Error fetching files', error);
    }
  };
  
  // Toggle container expansion
  const handleContainerClick = (container) => {
    setExpandedContainers(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(container)) {
        newExpanded.delete(container);
        setFiles(prevFiles => ({ ...prevFiles, [container]: [] })); // Clear files when collapsing
      } else {
        newExpanded.add(container);
        fetchFilesForContainer(container);
      }
      return newExpanded;
    });
  };
  
  // Handle file selection (Checkbox)
  const handleFileSelection = async (file) => {
    if (selectedFiles.length >= 10 && !selectedFiles.includes(file)) {
      alert('You can select a maximum of 10 files.');
      return;
    }
  
    const newSelectedFiles = selectedFiles.includes(file)
      ? selectedFiles.filter((selectedFile) => selectedFile !== file)
      : [...selectedFiles, file];
  
    setSelectedFiles(newSelectedFiles);
  
    if (!selectedFiles.includes(file)) {
      const geojsonData = await fetchGeoJSON(file);
      addGeoJSONToMap(geojsonData, file);
    } else {
      removeGeoJSONFromMap(file);
    }
  };
  
  // Fetch GeoJSON data for a selected file
  const fetchGeoJSON = async (file) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blobs/containers/${expandedContainers.values().next().value}/blobs/${encodeURIComponent(file)}`); // Corrected URL
      return response.data;
    } catch (error) {
      console.error('Error fetching GeoJSON', error);
    }
  };
  
 
  // Add GeoJSON data to the map
  const addGeoJSONToMap = (geojsonData, file) => {
    if (!geojsonData) return;
 
    const color = colorPalette[selectedFiles.length % 10];
 
    const geojsonLayer = geojsonData.features.map((feature) => {
      if (feature.geometry.type === 'Point') {
        return (
          <Marker
            key={uuidv4()}
            position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
            icon={L.icon({
              iconUrl: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              iconSize: [25, 25],
              iconAnchor: [12, 25],
            })}
          >
            <Popup>{file}</Popup>
          </Marker>
        );
      } else {
        return (
          <GeoJSON
            key={uuidv4()}
            data={feature}
            style={{ color, weight: 2, opacity: 0.6 }}
          />
        );
      }
    });
 
    setGeojsonLayers((prevLayers) => [...prevLayers, ...geojsonLayer]);
  };
 
  // Remove GeoJSON data from the map
  const removeGeoJSONFromMap = (file) => {
    setGeojsonLayers((prevLayers) =>
      prevLayers.filter((layer) => layer.key !== file)
    );
  };
 
  // Render the container tree structure (recursive)
  const renderTree = (containers) => {
    return containers.map((container) => {
      const isExpanded = expandedContainers.has(container);
      return (
        <li key={container} style={{ marginBottom: '10px' }}>
          <div
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() => handleContainerClick(container)}
          >
            <span style={{ marginRight: '10px' }}>
              {isExpanded ? '▼' : '▶'} {/* Custom arrow marks */}
            </span>
            {container}
          </div>
          {isExpanded && files[container] && (
            <ul
              style={{
                listStyleType: 'none',
                paddingLeft: '20px',
                marginTop: '10px',
                maxHeight: '400px', // Set a max height for expanded container's file list
                overflowY: 'auto', // Add scroll if files exceed the height
              }}
            >
              {files[container].map((file) => (
                <li key={file} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file)}
                    onChange={() => handleFileSelection(file)}
                  />
                  <span style={{ marginLeft: '8px' }}>{file}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    });
  };
 
  return (
    <div style={{ height: '80vh', width: '100%', position: 'relative' }}>
      {/* Map */}
      <MapContainer center={walsallCoordinates} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geojsonLayers}
      </MapContainer>
 
      {/* Containers List Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          padding: '10px',
          maxHeight: '80%',
          overflowY: 'auto',
          zIndex: 1000,
          width: '250px', // Width of the container list
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>Containers</h2>
        <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
          {renderTree(containers)}
        </ul>
      </div>
    </div>
  );
};
 
export default UKdata;