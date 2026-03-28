import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E1E2E',
            color: '#E5E7EB',
            border: '1px solid #2D2D3D',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#F4C430', secondary: '#0A0A0F' } },
          error: { iconTheme: { primary: '#FF6B00', secondary: '#0A0A0F' } },
        }}
      />
    </HelmetProvider>
  </React.StrictMode>
);
