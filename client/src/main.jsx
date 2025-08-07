import { StrictMode } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { apiSlice } from './api/apiSlice.js';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <ApiProvider api={apiSlice}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ApiProvider>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>,
)
