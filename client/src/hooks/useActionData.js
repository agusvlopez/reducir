import { useState } from "react";
import { useCheckSavedActionQuery, useToggleSavedActionMutation } from "../api/actionsSlice";


export function useActionData(userId, actionId) {
    const [isActionAddedToHabit, setIsActionAddedToHabit] = useState(false);
    const [isActionAchieved, setIsActionAchieved] = useState(false);
    
    const [toggleSavedAction] = useToggleSavedActionMutation();
    
    const { data: isActionSaved = false, isLoading: isActionSavedLoading } = useCheckSavedActionQuery(
        { userId, actionId },
        { skip: !userId || !actionId }
    );

    const handleToggleSaved = async () => {
        await toggleSavedAction({ userId, actionId });
    };

    const handleAddNewHabit = () => {
        setIsActionAddedToHabit(!isActionAddedToHabit);
    };

    return {
        isActionSaved,
        isActionSavedLoading,
        isActionAddedToHabit,
        isActionAchieved,
        setIsActionAchieved,
        handleToggleSaved,
        handleAddNewHabit
    };
}