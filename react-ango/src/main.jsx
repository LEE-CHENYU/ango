import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import posthog from 'posthog-js';

posthog.init('phc_tP2hBUrf9fr0K9Swti4JAQ3yzL0Odr6SLdNipbKKMKU', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only'
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
