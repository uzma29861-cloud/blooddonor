import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import 'leaflet/dist/leaflet.css';

console.log('[LifePulse] Mounting React application...');

try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <AppProvider>
            <App />
          </AppProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('[LifePulse] React mounted successfully.');
  } else {
    console.error('[LifePulse] Root element #root not found.');
  }
} catch (err) {
  console.error('[LifePulse] Fatal render error:', err);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f172a;color:#fff;font-family:sans-serif;padding:20px;">
        <div style="background:#1e293b;border:2px solid #e11d48;padding:24px;border-radius:16px;max-width:500px;text-align:center;">
          <h2 style="color:#f43f5e;font-size:20px;margin-bottom:8px;">Fatal Startup Error</h2>
          <pre style="background:#000;padding:12px;border-radius:8px;font-size:12px;color:#fecdd3;text-align:left;overflow:auto;">${err?.stack || err?.message || err}</pre>
          <button onclick="localStorage.clear();sessionStorage.clear();location.reload();" style="margin-top:16px;background:#e11d48;color:white;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer;">Clear Cache & Reload</button>
        </div>
      </div>
    `;
  }
}
