import { createContext, useState } from "react";
import { useSetCarbonGoalMutation } from "../api/apiSlice";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const GoalsContext = createContext();

export default GoalsContext;

export const GoalsProvider = ({ children }) => {
    const { userId } = useAuth();
    const [setCarbonGoal, { isLoading }] = useSetCarbonGoalMutation();
    
    const [customGoal, setCustomGoal] = useState(false);
    const [sliderValue, setSliderValue] = useState(10);

    const handleCustomGoal = () => setCustomGoal(!customGoal);

    const handleSetGoal = async (value) => {
        const percentage = value || sliderValue;
        try {
            await setCarbonGoal({
                userId,
                reductionPercentage: percentage
            }).unwrap();

            toast.success("Objetivo establecido con éxito");
            setCustomGoal(false);
        } catch (error) {
            toast.error(error.data?.error || "Error al establecer el objetivo");
        }
    }

    return (
        <GoalsContext.Provider value={{
            customGoal,
            sliderValue,
            isLoading,
            setSliderValue,
            handleCustomGoal,
            handleSetGoal
        }}>
            {children}
        </GoalsContext.Provider>
    );
}