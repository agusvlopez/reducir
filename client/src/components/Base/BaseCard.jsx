import { Link } from "react-router";
import { BaseButton } from "./BaseButton";
import { Heading } from "./Heading";

export function BaseCard({
    title,
    subtitle,
    imageSrc,
    imageAlt,
    labelButton,
    className = "",
    size = "md",
    color = "white",
    isReverse = false,
    link = ""
}) {
    const sizeClasses = {
        sm: "max-w-[300px] h-[150px]",
        md: "max-w-[354px] h-[182px]",
        lg: "max-w-[400px] h-[220px]",
    };

    const colorClasses = {
        white: "bg-white text-[#005840]",
        green: "bg-[#005840] text-white",
    };

    const variantColor = color === "white" ? "green" : "outline";

    return (
        <div
            className={`rounded-[30px] mx-auto flex items-center ${isReverse && "flex-row-reverse"} justify-center gap-2 shadow-lg p-4 px-6 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        >
            <div>
                <img src={imageSrc} alt={imageAlt} />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-xs uppercase">{title}</span>
                <div className="flex flex-col gap-4">
                    <p className="font-semibold">{subtitle}</p>
                    <Link to={link}>
                        <BaseButton
                            variant={variantColor}
                            className="text-sm font-semibold">
                            <span className="flex items-center justify-between gap-2">
                                {labelButton}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                        </BaseButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}