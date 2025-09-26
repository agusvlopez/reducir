import { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCheckFavoriteActionQuery, useGetFavoriteActionsQuery, useToggleFavoriteActionMutation } from "../api/actionsSlice";


const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user, userId } = useAuth();
  const [toggleFavoriteAction] = useToggleFavoriteActionMutation();

  const toggleFavorites = async ({ userId, actionId }) => {
    try {
      const response = await toggleFavoriteAction({ userId, actionId }).unwrap();
      console.log('Response from server:', response);
      return response;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  const { data: favorites = [], favoritesIsLoading } = useGetFavoriteActionsQuery(
    userId,
    { skip: !userId }
  );


  const contextValue = {
    favorites,
    favoritesIsLoading,
    toggleFavorites,
    userId: user?.id
  }

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

// Hook personalizado para usar en componentes
export const useFavoriteStatus = (actionId) => {
  const { userId } = useAuth();
  
  const { data: isFavorite = false, isLoading } = useCheckFavoriteActionQuery(
    { userId, actionId },
    { skip: !userId || !actionId }
  );

  return { isFavorite, isLoading };
};
