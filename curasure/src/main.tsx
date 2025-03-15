import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Global CSS import

// Grab the root element.
// Casting is often needed because getElementById can return HTMLElement or null.
const rootElement = document.getElementById('root') as HTMLElement;

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
