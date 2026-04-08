import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              fontFamily: 'DM Sans, sans-serif',
            },
            success: { iconTheme: { primary: 'var(--orange)', secondary: 'var(--bg)' } },
            error:   { iconTheme: { primary: '#EF4444',       secondary: 'var(--bg)' } },
          }}
        />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
