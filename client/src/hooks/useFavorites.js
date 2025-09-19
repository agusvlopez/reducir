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
      await toggleFavorites({ userId, actionId });
    } catch (error) {
      console.error("Error al cambiar favorito:", error);
      toast.error("Error al cambiar favorito");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    ...context, // Spread todas las funciones/datos del contexto original
    handleToggleFavorite,
    isProcessing,
  };
};