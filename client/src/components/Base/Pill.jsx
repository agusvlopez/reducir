export function Pill({ text, className = "" }) {
    return (
        <span
            className={`min-w-fit px-2 py-1 text-xs h-[30px] text-white bg-[#005840] rounded-[30px] ${className}`}
        >
            {text}
        </span>
    );
}