import { ChevronRight } from "../Icons/ChevronRight";

export default function BaseButton({
    variant = "green",
    size = "md",
    buttonType = "button",
    children,
    className,
    isButton = true,
    ...props
}) {
    // Define the base styles for the button depending on the variant
    const variantStyles = {
        green: "border border-[#005840] bg-[#005840] text-white",
        white: "bg-gray-light text-[#005840]",
        danger: "bg-red-500 text-white",
        outline: "border border-[#005840] text-[#005840] bg-white",
    }
    
    const sizeStyles = {
        sm: "text-xs py-1 px-2",
        md: "text-sm py-2 px-4 h-[42px]",
        lg: "text-lg py-3 px-6",
    }

    return (
        <button
            type={buttonType}
            className={`w-fit rounded-[30px] flex items-center justify-center shadow-md font-medium ${className} ${variantStyles[variant]} ${sizeStyles[size]}`}
            {...props}
        >
            {children}
            {isButton && <ChevronRight className="size-5 ml-2" />}
        </button>
    );
}