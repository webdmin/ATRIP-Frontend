// datasource.js

import React from "react";
import "./datasource.css";
import Openstreet from "../images/openstreetmap.png";
import OrdnanceSurvey from "../images/Ordnancesurvey.png";
import Overpass from "../images/overpass.png";
import Mapbox from "../images/mapbox.png";
import Leaflet from "../images/Leaflet_logo.svg.png";

const dataSources = [
  { name: "Openstreet", logo: Openstreet },
  { name: "Ordnance Survey", logo: OrdnanceSurvey },
  { name: "Overpass API", logo: Overpass },
  { name: "Mapbox", logo: Mapbox },
  { name: "Leaflet", logo: Leaflet },
];

const DataSource = () => {
  return (
    <section className="datasource-section">
      <h2 className="datasource-title">Reliable data sources</h2>
      <div className="datasource-grid">
        {dataSources.map((source, index) => (
          <div className="datasource-card" key={index}>
            <img
              src={source.logo}
              alt={`${source.name} logo`}
              className="datasource-logo"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DataSource;
