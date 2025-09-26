// import { useContext, useState } from "react";
// import { toast } from "sonner";
// import FavoritesContext from "../context/FavoritesContext";

// export const useFavorites = () => {
//   const context = useContext(FavoritesContext);
//   const [isProcessing, setIsProcessing] = useState(false);

//   if (!context) {
//     throw new Error('useFavorites must be used within a FavoritesProvider');
//   }

//   const { toggleFavorites } = context;

//   const handleToggleFavorite = async ({userId, actionId}) => {
//     if (isProcessing) return;

//     try {
//       setIsProcessing(true);
//       const response = await toggleFavorites({ userId, actionId });

//       if (response.isAdded) {
//         toast.success("Agregado a favoritos");
//       } else {
//         toast.success("Eliminado de favoritos");
//       }
//     } catch (error) {
//       toast.error("Error al cambiar favorito");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return {
//     ...context,
//     handleToggleFavorite,
//     isProcessing,
//   };
// };