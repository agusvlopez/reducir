import { useContext, useState } from "react";
import { toast } from "sonner";
import FavoritesContext from "../context/FavoritesContext";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const { userId } = useAuth();

  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  const { toggleFavorites, isFavorite } = context;

  const handleToggleFavorite = async (actionId) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const response = await toggleFavorites({ userId, actionId });
      console.log("response",response.isAdded);
      if (response.isAdded) {
        toast.success("Agregado a favoritos");
      } else {
        toast.success("Eliminado de favoritos");
      }
      
    } catch (error) {
      console.error("Error al cambiar favorito:", error);
      toast.error("Error al cambiar favorito");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    ...context,
    handleToggleFavorite,
    isProcessing,
  };
};