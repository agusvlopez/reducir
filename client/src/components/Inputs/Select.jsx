export function Select({
    options = [],
    value = "",
    onChange = () => { },
    placeholder = "Seleccionar...",
    className = "",
}) {
    return (
        <div className={`relative w-full ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-10 px-4 text-sm border rounded-full focus:outline-none focus:ring-2 appearance-none border-gray-300 bg-[#F1EDEC] text-[#383838] cursor-pointer focus:ring-[#005840] focus:border-[#005840] shadow-sm"
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="text-[#383838] border-b border-gray-200 hover:bg-gray-100">
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
    );
}