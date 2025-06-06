export function Pill({
    text,
    className = "",
    size = "md"
}) {
    const sizeClasses = {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
    };

    const sizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <span
            className={`min-w-fit ${sizeClass} text-white bg-[#005840] rounded-[30px] ${className}`}
        >
            {text}
        </span>
    );
}