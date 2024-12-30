import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom'; // Use Router from react-router-dom v7
import { createMemoryHistory } from 'history'; // Import createMemoryHistory from 'history' package
import App from './App';

test('renders learn react link', () => {
  const history = createMemoryHistory(); // Create a history object
  render(
    <Router location={history.location} navigator={history}> {/* Pass history object to Router */}
      <App />
    </Router>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
