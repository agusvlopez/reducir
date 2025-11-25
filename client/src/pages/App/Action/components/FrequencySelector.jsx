import { frequencyOptions } from "../../../../constants/frequencyActions";

export default function FrequencySelector({ frequency, onFrequencyChange }) {
    return (
        <div className="bg-white rounded-[30px] shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ¿Con qué frecuencia lo harás?
            </h3>
            <div className="space-y-3">
                {frequencyOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onFrequencyChange(option.value)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                            frequency === option.value
                                ? 'border-[#005840] bg-[#005840]/5 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                    >
                        <span className="text-2xl">{option.icon}</span>
                        <span className={`flex-1 text-left font-medium ${
                            frequency === option.value 
                                ? 'text-[#005840]' 
                                : 'text-gray-700'
                        }`}>
                            {option.label}
                        </span>
                        {frequency === option.value && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#005840]">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}