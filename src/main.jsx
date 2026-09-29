import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// StrictMode is disabled to prevent GSAP animations from double-firing
// and leaving elements stuck at opacity:0 during development
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
