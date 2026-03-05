import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Service Worker Registration for PWA (Web APK support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.worker = navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('Admin SW registered: ', registration);
    }).catch(registrationError => {
      console.log('Admin SW registration failed: ', registrationError);
    });
  });
}
