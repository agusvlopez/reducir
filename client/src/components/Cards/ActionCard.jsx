import { Link } from "react-router-dom";
import { Pill } from "../Base/Pill";
import { useState } from "react";
import { HeartIcon } from "../Icons/Heart";
import CarbonIcon from "../../assets/icons/carbon-green.png";
import { ImagePill } from "../Base/ImagePill";

export function ActionCard({
    title,
    category = "",
    carbon = 0,
    description = "",
    imageSrc,
    imageAlt = "Action Image",
    className = ""
}) {
    const [isAchievementAdded, setIsAchievementAdded] = useState(false);

    return (
        <div
            className={`rounded-[30px] shadow-md border lg:w-[348px] lg:h-[175px] flex items-center justify-around gap-4 p-4 bg-[#F1EDEC] text-[#005840] hover:opacity-85 hover:shadow-xl transition-all ${className}`}>
            <div
                className="flex-none">
                <Link
                    to=""
                >
                    <ImagePill
                        category={category}
                        imageSrc={imageSrc}
                        imageAlt={imageAlt}
                        size="sm"
                    />
                </Link>
            </div>

            <div className="flex">
                <Link
                    to=""
                >
                    <div className="mt-2 flex flex-col gap-1">
                        <p className="text-md font-medium my-1 line-clamp-2">{title}</p>

                        <span className="text-sm text-foreground/60 flex items-center gap-1">
                            <img src={CarbonIcon} alt="Dióxido de carbono" />
                            -{carbon} kg
                        </span>

                        <p className="text-small text-foreground/80 line-clamp-2">{description}</p>

                    </div>
                </Link>

                {!isAchievementAdded ?
                    <button>
                        <HeartIcon />
                    </button>
                    :
                    <div>
                        <p className="font-semibold text-center text-sm flex items-center gap-2 text-[#ED6C1D]">
                            <span>¡Acción lograda!</span>
                            <span className="iconAchievement"></span>
                        </p>
                    </div>
                }
            </div>
        </div>
    );
}