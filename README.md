# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)





-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

In the revised approach, I used separate `google.maps.Data` layers for different types of geometries (points, polygons, and lines) rather than relying on z-index for managing overlapping. Here’s a breakdown of how this method works and why it can be effective:

### Key Differences:

1. Separate Data Layers:
   - Old Approach: Used a single `google.maps.Data` layer for all GeoJSON features and attempted to manage display order using z-index.
   - New Approach: Created distinct `google.maps.Data` layers for each type of geometry: points, polygons, and lines. Each layer handles only one type of geometry.

2. Layer Initialization and Style:
   - Old Approach: Applied z-index to the features directly and attempted to manage visibility and ordering through z-index values.
   - New Approach: Initialized separate `Data` layers for each geometry type and set distinct styles for each layer:
     - Points Layer: Uses circle icons for points.
     - Polygons Layer: Styles polygons with fill and stroke colors.
     - Lines Layer: Styles lines with stroke color.

3. Layer Assignment:
   - Old Approach: Added all GeoJSON features to a single `Data` layer and tried to manage the appearance through z-index, which can be prone to issues with complex geometries.
   - New Approach: Added GeoJSON features to the appropriate layer based on their geometry type (e.g., points to `pointsLayer`, polygons to `polygonsLayer`, lines to `linesLayer`). This separation helps in rendering each type correctly and independently.

### Why It Works:

- Separation of Concerns: By using different layers for different geometry types, you ensure that each layer is responsible for rendering only one type of feature. This separation prevents issues where overlapping or styling conflicts occur because each layer handles its own set of features.
  
- Layer-Specific Styling: Each layer can have its own style configuration, which makes it easier to control how each type of geometry is displayed without interference from others. For instance, you can have specific styles for points, polygons, and lines that do not affect each other.

- Layer Visibility Control: Managing visibility becomes more straightforward. If you need to show or hide a specific type of feature (e.g., all points), you can toggle the visibility of the `pointsLayer` without affecting polygons or lines.

### Summary:

By using separate `google.maps.Data` layers for different types of features, you effectively avoid the complications associated with overlapping geometries and z-index management. This method provides better control over rendering, styling, and visibility of various types of GeoJSON features on the map.