import { Link } from "react-router-dom";
import BaseButton from "./BaseButton";
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
                                {labelButton}
                        </BaseButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}