
import { useCheckSavedActionQuery } from "../api/actionsSlice";
import { useAuth } from "./useAuth";

export const useActionsSavedStatus = (actionId) => {
  const { userId } = useAuth();
  
  const { data: isActionSaved = false, isLoading } = useCheckSavedActionQuery(
    { userId, actionId },
    { skip: !userId || !actionId }
  );

  return { isActionSaved, isLoading };
}