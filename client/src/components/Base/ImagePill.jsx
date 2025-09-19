import { Pill } from "./Pill";

export function ImagePill({
    imageSrc,
    imageAlt = "Image Pill",
    className = "",
    size = "default",
    category
}) {
    const sizeClasses = {
        default: "",
        sm: "w-[132px] h-[132px]",
        md: "w-[356px] h-[356px]",
    };

    const sizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <div className={`relative ${className}`}>
            <Pill
                size="sm"
                text={category}
                className="absolute z-10 top-3 right-3 shadow-md backgroundDarkGreen text-white"
                isButton={false}
            />

            <img
                className={`object-cover aspect-[4/4] rounded-[30px] ${sizeClass}`}
                src={imageSrc}
                alt={imageAlt}
            />
        </div>
    );
}