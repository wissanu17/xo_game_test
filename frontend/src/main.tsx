import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css'; // This imports the Tailwind CSS

// Ensure the DOM is fully loaded before rendering
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

// Use createRoot instead of ReactDOM.render
const root = createRoot(rootElement);

// Render app with StrictMode for better development experience
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);