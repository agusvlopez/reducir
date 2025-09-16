import { createContext, useState } from "react";
import { useToggleFavoriteActionMutation } from "../api/apiSlice";

const FavoritesContext = createContext();

export const FavoritesProvider = ({children}) => {
  const [favorites, setFavorites] = useState([]);

  const [toggleFavoriteAction] = useToggleFavoriteActionMutation();

  const toggleFavorites = async ({ userId, actionId }) => {
    const response = await toggleFavoriteAction({ userId, actionId }).unwrap();

    setFavorites(response.user.favorites);
      
    return response;
  }

  // Función helper para verificar si un item está en favoritos
  const isFavorite = (actionId) => {
    return favorites.includes(actionId);
  }

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