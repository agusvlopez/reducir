export default function CompletionButton({ checkedDays, maxChecksByFrequency, onComplete }) {
    const maxChecks = 30;
    
    return (
        <div className="bg-white rounded-[30px] shadow-sm p-6">
            <button
                onClick={onComplete}
                disabled={checkedDays.length === 0}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-200 ${
                    checkedDays.length > 0
                        ? 'bg-[#005840] text-white hover:bg-[#004433] shadow-md hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                {checkedDays.length === 0 
                    ? 'Marca al menos 1 día para continuar'
                    : checkedDays.length === maxChecksByFrequency
                    ? '¡Completar acción! 🎉'
                    : `Guardar progreso (${checkedDays.length}/${maxChecks})`
                }
            </button>
            
            {checkedDays.length > 0 && checkedDays.length < maxChecks && (
                <p className="text-center text-sm text-gray-500 mt-3">
                    Podés guardar tu progreso parcial y continuar después
                </p>
            )}
        </div>
    );
}