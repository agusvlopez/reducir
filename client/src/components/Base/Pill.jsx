export function Pill({
    text,
    className = "",
    size = "md",
    color = "green",
}) {
    const sizeClasses = {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
    };

    const colorClasses = {
        green: "text-white bg-[#005840]",
        orange: "text-white bg-[#ED6C1D]"
    };

    return (
        <span
            className={`w-fit ${sizeClasses[size]} ${colorClasses[color]} rounded-[30px] ${className}`}
        >
            {text}
        </span>
    );
}