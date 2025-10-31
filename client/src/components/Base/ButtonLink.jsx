import { Link } from "react-router-dom";
import { ChevronRight } from "../Icons/ChevronRight";
import { Loader } from "./Loader";

export default function ButtonLink({
    variant = "filled",
    size = "md",
    to, // Para React Router Link
    href, // Para enlaces externos <a>
    children,
    className = "",
    withArrow = false,
    isDisabled = false,
    isLoading = false,
    external = false, // Si es true, abre en nueva pestaña
    ...props
}) {
    // Material Design 3 variant styles
    const variantStyles = {
        // Filled button (Principal)
        filled: "bg-[#005840] text-white hover:shadow-md hover:bg-[#00684d] active:bg-[#004d39] disabled:bg-gray-300 disabled:text-gray-500",
        
        // Outlined button
        outlined: "border border-white text-white bg-transparent hover:bg-[#005840]/8 active:bg-[#005840]/12 disabled:border-gray-300 disabled:text-gray-400",
        
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
        md: "text-sm h-10 px-6 gap-2",
        lg: "text-base h-12 px-8 gap-2.5",
    }

    // Icon size based on button size
    const iconSize = {
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
    }

    // Clases base compartidas
    const baseClasses = `
        w-fit 
        inline-flex 
        items-center 
        justify-center 
        font-medium 
        rounded-full
        transition-all 
        duration-200
        no-underline
        ${isDisabled ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
        ${variantStyles[variant]} 
        ${sizeStyles[size]}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    // Contenido del botón
    const content = (
        <>
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
        </>
    );

    // Si tiene href, renderiza <a> (link externo)
    if (href) {
        return (
            <a
                href={href}
                className={baseClasses}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-disabled={isDisabled}
                {...props}
            >
                {content}
            </a>
        );
    }

    // Si tiene to, renderiza React Router Link (link interno)
    if (to) {
        return (
            <Link
                to={to}
                className={baseClasses}
                aria-disabled={isDisabled}
                onClick={(e) => {
                    if (isDisabled) {
                        e.preventDefault();
                    }
                }}
                {...props}
            >
                {content}
            </Link>
        );
    }

    // Si no tiene ni href ni to, advertir en consola (desarrollo)
    console.warn('ButtonLink requires either "to" or "href" prop');
    return null;
}