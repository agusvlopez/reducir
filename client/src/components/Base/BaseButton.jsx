import { ChevronRight } from "../Icons/ChevronRight";
import { Loader } from "./Loader";

export default function BaseButton({
    variant = "filled",
    size = "md",
    buttonType = "button",
    children,
    className = "",
    withArrow = false,
    isDisabled = false,
    isLoading = false,
    ...props
}) {
    // Material Design 3 variant styles
    const variantStyles = {
        // Filled button (Principal)
        filled: "bg-[#005840] text-white hover:shadow-md hover:bg-[#00684d] active:bg-[#004d39] disabled:bg-gray-300 disabled:text-gray-500",
        
        // Outlined button
        outlined: "border border-dark-green text-[#005840] bg-transparent hover:bg-[#005840]/8 active:bg-[#005840]/12 disabled:border-gray-300 disabled:text-gray-400",
        
        // Text button
        text: "text-[#005840] bg-transparent hover:bg-[#005840]/8 active:bg-[#005840]/12 disabled:text-gray-400",
        
        // Elevated button
        elevated: "bg-[#F7F2FA] text-[#005840] shadow-sm hover:shadow-md hover:bg-[#EDE7F0] active:bg-[#E3DDE6] disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none",
        
        // Tonal button (Filled tonal)
        tonal: "bg-[#D0E8E0] text-[#00382D] hover:shadow-sm hover:bg-[#BFD9D1] active:bg-[#AECAC2] disabled:bg-gray-200 disabled:text-gray-400",
    }
    
    // Material Design 3 size styles
    const sizeStyles = {
        sm: "text-xs h-8 px-3 gap-2",
        md: "text-sm h-10 px-4 gap-2",
        lg: "text-base h-12 px-8 gap-2.5",
    }

    // Icon size based on button size
    const iconSize = {
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
    }

    return (
        <button
            disabled={isDisabled || isLoading}
            type={buttonType}
            className={`
                cursor-pointer 
                w-fit 
                inline-flex 
                items-center 
                justify-center 
                font-medium 
                rounded-full
                transition-all 
                duration-200
                disabled:cursor-not-allowed
                disabled:pointer-events-none
                ${variantStyles[variant]} 
                ${sizeStyles[size]}
                ${className}
            `.trim().replace(/\s+/g, ' ')}
            {...props}
        >
            {isLoading ? (
                <Loader size="sm" color={variant === "filled" ? "white" : "green"} />
            ) : (
                <>
                    {children}
                    {withArrow && (
                        <ChevronRight className={iconSize[size]} />
                    )}
                </>
            )}
        </button>
    );
}