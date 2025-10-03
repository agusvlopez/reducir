import { useContext } from "react";
import ActionsSavedContext from "../context/ActionsSavedContext";

export const useActionsSaved = () => {
  const context = useContext(ActionsSavedContext);
  if (!context) {
    throw new Error('useFavorites must be used within ActionsSavedProvider');
  }
  return context;
};