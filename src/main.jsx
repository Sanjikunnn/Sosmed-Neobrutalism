import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Mengimpor App.jsx yang berisi routing
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> {/* Render App.jsx */}
  </StrictMode>
);
