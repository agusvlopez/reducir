import { createContext, useState, useEffect } from "react";
import { useToggleFavoriteActionMutation } from "../api/apiSlice";
import { useAuth } from "../hooks/useAuth";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  // Sincroniza el estado de favoritos con el usuario autenticado
  useEffect(() => {
    setFavorites(user?.favorites || []);
  }, [user]);

  const [toggleFavoriteAction] = useToggleFavoriteActionMutation();

  const toggleFavorites = async ({ userId, actionId }) => {
    // Guardamos el estado actual para poder revertir si es necesario
    const previousFavorites = [...favorites];
    const isCurrentlyFavorite = favorites.includes(actionId);
    
    // Optimistic update
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter(id => id !== actionId)
      : [...favorites, actionId];

    setFavorites(newFavorites);

    try {
      const response = await toggleFavoriteAction({ userId, actionId }).unwrap();
      
      // Sincronizamos con la respuesta del servidor
      setFavorites(response.user.favorites);
      
      return response;
    } catch (error) {
      // Revertimos al estado anterior en caso de error
      setFavorites(previousFavorites);
      
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const isFavorite = (actionId) => {
    return favorites.includes(actionId);
  };

  const contextValue = {
    favorites,
    toggleFavorites,
    isFavorite,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;