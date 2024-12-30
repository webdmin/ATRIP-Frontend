module.exports = {
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Use Babel for transforming JS/JSX files
    },
    transformIgnorePatterns: [
      '/node_modules/(?!react-leaflet|axios|mapbox-gl)/'  // Make sure to transform react-leaflet, axios, and mapbox-gl
    ],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // Optional: for testing-library setup
  };
  