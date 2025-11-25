import { useState, useEffect, useRef } from "react";
import { frequencyToChecks } from "../constants/frequencyActions";
import { useAddActionToAchievedMutation, useCheckActionProgressQuery, useUpdateActionProgressMutation } from "../api/actionsSlice";

export function useActionProgress(userId, actionId) {
    const [frequency, setFrequency] = useState('EveryDay');
    const [checkedDays, setCheckedDays] = useState([]);
    
    const [addActionToAchieved] = useAddActionToAchievedMutation();
    const [updateActionProgress] = useUpdateActionProgressMutation();
    
    const { data: progressResult } = useCheckActionProgressQuery(
      { userId, actionId },
      { skip: !userId || !actionId }
    );

    useEffect(() => {
        if (progressResult) {
            const { frequency: fetchedFrequency, progress: fetchedProgress } = progressResult;
            
            if (fetchedFrequency) {
                setFrequency(fetchedFrequency);
            }

            if (fetchedProgress !== undefined) {
                const maxChecksForFrequency = frequencyToChecks[fetchedFrequency] || 30;
                const numCheckedDays = Math.round((fetchedProgress / 100) * maxChecksForFrequency);
                const newCheckedDays = Array.from({ length: numCheckedDays }, (_, i) => i);
                                
                setCheckedDays(newCheckedDays);
            }
        }
    }, [progressResult]);

    const maxChecks = 30;
    const maxChecksByFrequency = frequencyToChecks[frequency];
    const progressPercentage = (checkedDays.length / maxChecksByFrequency) * 100;

    const debouncedUpdateProgressRef = useRef(null);

    const handleCheckToggle = (index) => {
        const newCheckedDays = checkedDays.includes(index)
            ? checkedDays.filter(i => i !== index)
            : [...checkedDays, index];
        
        setCheckedDays(newCheckedDays);
        
        const progressPercentage = Math.round((newCheckedDays.length / maxChecks) * 100);
        
        //?? TODO: CHEQUEAR ESTO que hace exactamente 
        if (debouncedUpdateProgressRef.current) {
            debouncedUpdateProgressRef.current(actionId, userId, progressPercentage);
        }
    }

    const handleFrequencyChange = (newFrequency) => {     
        setFrequency(newFrequency);
    }

    const handleAddToAchieved = async ({ action, carbon }) => {       
        const response = await addActionToAchieved({   
            userId,
            actionId: action._id,
            carbon,
            frequency,
            progress: progressPercentage,
        });

        console.log("response", response);       
    }

    return {
        frequency,
        checkedDays,
        progressPercentage,
        maxChecksByFrequency,
        handleCheckToggle,
        handleFrequencyChange,
        handleAddToAchieved
    }
}