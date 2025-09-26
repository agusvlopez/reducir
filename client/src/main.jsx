import './index.css';
import { HeroUIProvider } from '@heroui/react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'sonner';
import { store } from './utils/store.js';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { FavoritePostsProvider } from './context/FavoritePostsContext.jsx';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
        <HeroUIProvider>
          <AuthProvider>
            <FavoritesProvider>
              <FavoritePostsProvider>
                <App />
              </FavoritePostsProvider>
              <Toaster richColors />
            </FavoritesProvider>
          </AuthProvider>
        </HeroUIProvider>
      </BrowserRouter>
    </Provider>
)
