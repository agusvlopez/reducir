import BaseButton from "../../../../components/Base/BaseButton";
import { Loader } from "../../../../components/Base/Loader";
import { HeartIcon } from "../../../../components/Icons/Heart";


export default function ActionButtons({ 
    isActionSaved, 
    isActionSavedLoading,
    isActionAchieved,
    isActionAddedToHabit,
    onToggleSaved,
    onAddNewHabit
}) {
    return (
        <>
            {/* Botón de favoritos */}
            {!isActionAchieved && (
                <div className="bg-white rounded-[30px] shadow-sm p-2">
                    {isActionSavedLoading ? (
                        <div className="flex justify-center py-4">
                            <Loader size="sm" color="green" />
                        </div>
                    ) : (
                        <BaseButton 
                            onClick={onToggleSaved} 
                            className="w-full" 
                            isArray={false}
                            variant={isActionSaved ? 'white' : 'green'}
                        >
                            <HeartIcon 
                                className={`inline-block mr-2 ${isActionSaved ? 'text-[#005840]' : ''}`} 
                                isFilled={isActionSaved} 
                            />
                            {isActionSaved ? 'Quitar de mis favoritos' : 'Agregar a mis favoritos'}
                        </BaseButton>
                    )}
                </div>
            )}

            {/* Botón de completar */}
            <div className="bg-white rounded-[30px] shadow-sm p-6">
                <div className="flex items-center gap-4">
                    <BaseButton 
                        onClick={onAddNewHabit} 
                        variant="outline" 
                        isArray={!isActionAddedToHabit} 
                        className="flex-1"
                    >
                        {isActionAchieved && <PlusIcon className="inline-block mr-2" />}
                        <span className="text-base font-semibold">
                            {isActionAddedToHabit 
                                ? 'Agregar esta acción como hábito' 
                                : 'Elegí la frecuencia en la cual lo harás'}
                        </span>
                    </BaseButton>
                </div>
            </div>
        </>
    );
}