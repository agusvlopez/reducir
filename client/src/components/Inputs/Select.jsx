export function Select({
    label = "",
    options = [],
    onChange = () => { },
    placeholder = "Seleccionar...",
    selectId = "",
    selectName = "",
    isRequired = false,
    className = "",
    defaultValue = "",
}) {

    return (
        <div className={`flex flex-col gap-2 w-full`}>
            <label htmlFor={selectId}>{label}</label>
            <div className={`relative w-full ${className}`}>
                <select
                    id={selectId}
                    name={selectName}
                    required={isRequired}
                    defaultValue={defaultValue}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-10 px-4 text-sm border rounded-full focus:outline-none focus:ring-2 appearance-none border-gray-300 bg-[#F1EDEC] text-[#383838] cursor-pointer focus:ring-[#005840] focus:border-[#005840] shadow-sm"
                >
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                    {options?.map((option) => (
                        <option key={option.id} value={option.value} className="text-[#383838] border-b border-gray-200 hover:bg-gray-100">
                            {option.label}
                        </option>
                    ))}
                </select>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-[#383838] pointer-events-none"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 9l-7.5 7.5L4.5 9"
                    />
                </svg>
            </div>
        </div>
    );
}