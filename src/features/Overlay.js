import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { Treebeard, decorators as treebeardDecorators } from 'react-treebeard';
import './treebeard.css';
import ColorLegend from './ColorLegend';
import './ColorLegend.css';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
  position: 'relative',
};

const center = {
  lat: 52.588384,
  lng: -1.982158,
};

const options = {
  zoomControl: true,
  mapTypeControl: false,
};

const customDecorators = {
  ...treebeardDecorators,
  Header: ({ node, style }) => (
    <div style={style.base}>
      <div style={style.title}>
        {node.container && !node.children && (
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={node.checked || false}
              onChange={() => {}}
            />
            {node.name}
          </label>
        )}
        {!node.container && <span>{node.name}</span>}
      </div>
    </div>
  ),
};

const MAX_FILES = 10;

const layerColors = [
  '#0000ff', '#a52a2a', '#006400', '#8b008b', '#ff8c00',
  '#00008b', '#ff1493', '#228b22', '#708090', '#ffff00'
];

const MapComponent = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [fileColorMapping, setFileColorMapping] = useState({});
  const [showColorLegend, setShowColorLegend] = useState(false);
  const [mapType, setMapType] = useState('roadmap');
  const [showMapTypes, setShowMapTypes] = useState(false);

  const fetchTreeData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/containers');
      const containers = response.data;

      const tree = await Promise.all(
        containers.map(async (container) => {
          const containerData = await axios.get(`http://localhost:3001/containers/${container}/blobs`);
          const blobs = containerData.data;

          const folderNames = [...new Set(blobs.filter(blob => blob.includes('/')).map(blob => blob.split('/')[0]))];
          const fileNames = blobs.filter(blob => !blob.includes('/'));

          return {
            name: container,
            toggled: false,
            children: [
              ...folderNames.map(folder => ({
                name: folder,
                children: blobs
                  .filter(blob => blob.startsWith(`${folder}/`))
                  .map(blob => ({
                    name: blob.replace(`${folder}/`, ''),
                    container,
                    folder,
                    toggled: false,
                    checked: false,
                  })),
              })),
              ...fileNames.map(file => ({
                name: file,
                container,
                toggled: false,
                checked: false,
              })),
            ],
          };
        })
      );

      setTreeData(tree);
    } catch (error) {
      console.error('Error fetching containers:', error);
    }
  };

  useEffect(() => {
    fetchTreeData();
  }, []);

  useEffect(() => {
    const updateColorMapping = (files) => {
      const mapping = {};
      files.forEach(({ container, filePath }, index) => {
        const color = layerColors[index % layerColors.length];
        if (!mapping[color]) {
          mapping[color] = [];
        }
        mapping[color].push({ name: filePath, container });
      });
      setFileColorMapping(mapping);
    };

    updateColorMapping(selectedFiles);
  }, [selectedFiles]);

  const loadGeoJsonData = async (files) => {
    try {
      const newLayers = {};
      await Promise.all(files.map(async ({ container, filePath }, index) => {
        const url = `http://localhost:3001/containers/${container}/blobs/${encodeURIComponent(filePath)}`;
        const response = await axios.get(url);
        const geoJsonData = response.data;

        if (!geoJsonData || !geoJsonData.features) {
          console.error('Invalid GeoJSON data:', geoJsonData);
          return;
        }

        const color = layerColors[index % layerColors.length];

        const geoJsonLayer = L.geoJSON(geoJsonData, {
          style: () => ({
            color: color,
            weight: 2,
            opacity: 1,
            fillColor: color,
            fillOpacity: 0.5,
          }),
          onEachFeature: (feature, layer) => {
            if (feature.geometry.type === 'Point') {
              layer.on('mouseover', () => {
                const content = `
                  <div><strong>Title:</strong> ${feature.properties.title || 'N/A'}</div>
                  <div><strong>Description:</strong> ${feature.properties.description || 'N/A'}</div>
                  <div><strong>Label:</strong> ${feature.properties.label || 'N/A'}</div>
                  <div><strong>ID:</strong> ${feature.properties.id || 'N/A'}</div>
                `;
                layer.bindPopup(content).openPopup();
              });
            }
          }
        });

        newLayers[container] = newLayers[container] || [];
        newLayers[container].push(geoJsonLayer);
        geoJsonLayer.addTo(map);
      }));

      setShowColorLegend(selectedFiles.length > 0);
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
    }
  };

  const onToggle = async (node, toggled) => {
    if (!node.children) {
      setLoading(true);
      const filePath = node.folder ? `${node.folder}/${node.name}` : node.name;
      const selectedFile = { container: node.container, filePath };
      const updatedFiles = toggled
        ? [...selectedFiles, selectedFile]
        : selectedFiles.filter(file => !(file.container === node.container && file.filePath === filePath));

      if (updatedFiles.length > MAX_FILES) {
        alert('You are exceeding the maximum limit, please select up to 10 files!');
        setLoading(false);
        return;
      }

      setSelectedFiles(updatedFiles);
      await loadGeoJsonData(updatedFiles);
      node.toggled = toggled;
      node.checked = toggled;
      setTreeData([...treeData]);
      setLoading(false);
    } else {
      node.toggled = toggled;
      setTreeData([...treeData]);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      const results = [];
      const searchTree = (nodes) => {
        nodes.forEach(node => {
          if (node.name.toLowerCase().includes(term.toLowerCase())) {
            results.push(node);
          }
          if (node.children) {
            searchTree(node.children);
          }
        });
      };
      searchTree(treeData);
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const handleResultClick = (result) => {
    setFilteredResults([]);
    setSearchTerm('');
    result.checked = true;
    onToggle(result, true);
  };

  const toggleMapTypesMenu = () => {
    setShowMapTypes(!showMapTypes);
  };

  const selectMapType = (type) => {
    setMapType(type);
    setShowMapTypes(false);
  };

  return (
    <div>
      {loading && <div className="loading-overlay"><div>Loading...</div></div>}
      <div style={{ position: 'absolute', top: '100px', left: '10px', width: '350px', height: '80%', zIndex: '1000', display: 'flex', flexDirection: 'column' }}>
        <div className="tree-container">
          <input
            type="text"
            placeholder="Search files..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {filteredResults.length > 0 && (
            <div className="dropdown">
              {filteredResults.map((result, index) => (
                <div key={index} className="dropdown-item" onClick={() => handleResultClick(result)}>
                  {result.name}
                </div>
              ))}
            </div>
          )}
          <div className="tree-content">
            <Treebeard
              data={treeData}
              decorators={customDecorators}
              onToggle={onToggle}
            />
          </div>
        </div>
      </div>

      {showColorLegend && <ColorLegend fileColorMapping={fileColorMapping} />}

      <MapContainer center={center} zoom={12} style={mapContainerStyle}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {selectedFiles.map((file, index) =>
          file.geoJsonFeatures && file.geoJsonFeatures.map((feature, idx) =>
            feature.geometry.type === 'Point' && (
              <Marker
                key={`${index}-${idx}`}
                position={{
                  lat: feature.geometry.coordinates[1],
                  lng: feature.geometry.coordinates[0],
                }}
              >
                <Popup>
                  <div>
                    <strong>Title:</strong> {feature.properties.title || 'N/A'}
                    <br />
                    <strong>Description:</strong> {feature.properties.description || 'N/A'}
                  </div>
                </Popup>
              </Marker>
            )
          )
        )}
      </MapContainer>

      <div style={{
        position: 'absolute', top: '10px', right: '10px', zIndex: '1000'
      }}>
        <button
          onClick={toggleMapTypesMenu}
          style={{
            background: 'white', border: 'none', borderRadius: '2px', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)', position: 'relative', top: '90px', right: '10px'
          }}
        >
          Map Type
        </button>

        {showMapTypes && (
          <div style={{
            position: 'absolute', top: '80px', right: '70px', display: 'flex', background: 'white',
            padding: '15px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', flexDirection: 'row',
            color: 'black', width: '196px', flexWrap: 'wrap'
          }}>
            {/* Add map type selection here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
