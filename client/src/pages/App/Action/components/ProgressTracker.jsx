export default function ProgressTracker({ 
    checkedDays, 
    maxChecksByFrequency, 
    progressPercentage,
    onCheckToggle 
}) {
    const maxChecks = 30;

    return (
        <div className="bg-white rounded-[30px] shadow-sm p-6">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Progreso este mes
                    </h3>
                    <span className="text-sm font-medium text-[#005840]">
                        {checkedDays.length} / {maxChecksByFrequency}
                    </span>
                </div>
                
                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-[#005840] to-[#007a5a] h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Grid de checks */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {Array.from({ length: maxChecks }).map((_, index) => {
                    const isChecked = checkedDays?.includes(index);
                    
                    return (
                        <button
                            key={index}
                            onClick={() => onCheckToggle(index)}
                            className={`aspect-square rounded-2xl border-2 transition-all duration-200 flex items-center justify-center ${
                                isChecked
                                    ? 'border-[#005840] bg-[#005840] text-white shadow-md scale-105'
                                    : 'border-gray-300 hover:border-[#005840] hover:bg-[#005840]/5'
                            }`}
                            aria-label={`Día ${index + 1}`}
                        >
                            {isChecked ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <span className="text-xs font-medium text-gray-400">
                                    {index + 1}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Mensaje de progreso */}
            {checkedDays.length > 0 && (
                <div className={`p-4 rounded-2xl ${
                    checkedDays.length === maxChecksByFrequency
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-blue-50 border border-blue-200'
                }`}>
                    <p className={`text-sm font-medium ${
                        checkedDays.length === maxChecksByFrequency
                            ? 'text-green-800'
                            : 'text-blue-800'
                    }`}>
                        {checkedDays.length > maxChecksByFrequency && 
                            '¡Wow! 🎉 Estas haciendo mas de lo esperado'}
                        {checkedDays.length === maxChecksByFrequency && 
                            '¡Excelente! 🎉 Completaste tu objetivo esta semana'}
                        {checkedDays.length < maxChecksByFrequency && 
                            `¡Vas muy bien! Te faltan ${maxChecksByFrequency - checkedDays.length} ${maxChecksByFrequency - checkedDays.length === 1 ? 'vez' : 'veces'} más`}
                    </p>
                </div>
            )}
        </div>
    );
}