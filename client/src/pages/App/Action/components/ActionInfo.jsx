import CarbonImpactCard from "./CarbonImpactCard";
import ActionButtons from "./ActionButtons";
import FrequencySelector from "./FrequencySelector";
import ProgressTracker from "./ProgressTracker";
import CompletionButton from "./CompletionButton";
import CompletionMessage from "./CompletionMessage";
import TipsCard from "./TipsCard";

export default function ActionInfo({ action, actionData, progressData }) {
    console.log("action", action);
    
    const { 
        isActionSaved, 
        isActionSavedLoading,
        isActionAddedToHabit,
        isActionAchieved,
        handleToggleSaved,
        handleAddNewHabit
    } = actionData;

    const {
        frequency,
        checkedDays,
        progressPercentage,
        maxChecksByFrequency,
        handleFrequencyChange,
        handleCheckToggle,
        handleAddToAchieved
    } = progressData;

    return (
        <div className="lg:col-span-7 flex flex-col justify-center">
            <CarbonImpactCard 
                carbon={action.carbon}
                isActionAchieved={isActionAchieved}
            />

            <div className="space-y-4">
                <ActionButtons
                    isActionSaved={isActionSaved}
                    isActionSavedLoading={isActionSavedLoading}
                    isActionAchieved={isActionAchieved}
                    isActionAddedToHabit={isActionAddedToHabit}
                    onToggleSaved={handleToggleSaved}
                    onAddNewHabit={handleAddNewHabit}
                    actionId={action._id}
                />

                {!isActionAddedToHabit && (
                    <>
                        <FrequencySelector 
                            frequency={frequency}
                            onFrequencyChange={handleFrequencyChange}
                        />

                        <ProgressTracker
                            checkedDays={checkedDays}
                            maxChecksByFrequency={maxChecksByFrequency}
                            progressPercentage={progressPercentage}
                            onCheckToggle={handleCheckToggle}
                        />

                        <CompletionButton
                            checkedDays={checkedDays}
                            maxChecksByFrequency={maxChecksByFrequency}
                            onComplete={() => handleAddToAchieved({ action: action, carbon: action.carbon })}
                        />
                    </>
                )}

                {isActionAchieved && (
                    <CompletionMessage checkedDays={checkedDays} />
                )}

                <TipsCard isActionAchieved={isActionAchieved} />
            </div>
        </div>
    );
}