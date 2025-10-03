import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { useGetSavedActionsQuery, useToggleSavedActionMutation } from "../api/actionsSlice";


const ActionsSavedContext = createContext();

export const ActionsSavedProvider = ({ children }) => {
  const { user, userId } = useAuth();
  const [toggleSavedAction] = useToggleSavedActionMutation();

  const toggleAction = async ({ userId, actionId }) => {
    return await toggleSavedAction({ userId, actionId }).unwrap();
  }

  const { data: actionsSaved = [], actionsSavedLoading } = useGetSavedActionsQuery(
    userId,
    { skip: !userId }
  );


  const contextValue = {
    actionsSaved,
    actionsSavedLoading,
    toggleAction,
    userId: user?.id
  }

  return (
    <ActionsSavedContext.Provider value={contextValue}>
      {children}
    </ActionsSavedContext.Provider>
  );
}

export default ActionsSavedContext;