export default function BaseButton({
    variant = "green",
    buttonType = "button",
    children,
    className,
    ...props
}) {
    // Define the base styles for the button depending on the variant
    const variantStyles = {
        green: "border border-[#005840] bg-[#005840] text-white",
        white: "bg-[#F5F5F5] text-[#005840]",
        danger: "bg-red-500 text-white",
        outline: "border border-[#005840] text-[#005840] bg-white",
    };

    return (
        <button
            type={buttonType}
            className={`w-fit py-2 px-4 rounded-[30px] flex items-center justify-center ${className} ${variantStyles[variant]}`}
            {...props}
        >
            {children}
        </button>
    );
}