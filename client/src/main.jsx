import { HeroUIProvider } from '@heroui/react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'sonner';
import { store } from './utils/store.js';
import { FavoritesProvider } from './context/FavoritesContext.jsx';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
        <HeroUIProvider>
          <AuthProvider>
            <FavoritesProvider>
              <App />
              <Toaster richColors />
            </FavoritesProvider>
          </AuthProvider>
        </HeroUIProvider>
      </BrowserRouter>
    </Provider>
)
