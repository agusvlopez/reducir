import { useState } from "react";

export function Search({
    onSearch,
    placeholder = "Buscar...",
    className = ""
}) {
    const [searchValue, setSearchValue] = useState("");

    const handleChange = (e) => {
        setSearchValue(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <input
                onChange={handleChange}
                value={searchValue}
                type="text"
                placeholder={placeholder}
                className="w-full h-10 px-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 bg-[#F1EDEC] text-[#383838] shadow-sm"
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2.25-4.5a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
                />
            </svg>
        </div>
    );
}