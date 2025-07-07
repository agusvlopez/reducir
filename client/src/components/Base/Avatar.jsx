export function Avatar({
    src,
    alt = "Avatar",
    size = "md",
    isBordered = false,
    className = ""
}) {
    // Define size classes based on the size prop
    const sizeClasses = {
        sm: "w-[40px] h-[40px]",
        md: "w-[50px] h-[50px]",
        lg: "w-[77px] h-[77px]"
    };

    return (
        <img
            src={src}
            alt={alt}
            className={`rounded-full ${sizeClasses[size]} ${isBordered && "border-2 border-[#ED6C1D]"} object-cover ${className}`}
        />
    );
}