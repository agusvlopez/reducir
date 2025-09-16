import { Link } from "react-router-dom";
import { useState } from "react";
import { HeartIcon } from "../Icons/Heart";
import CarbonIcon from "../../assets/icons/carbon-green.png";
import { ImagePill } from "../Base/ImagePill";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites.js";
import { toast } from "sonner";

export function ActionCard({
    id,
    title,
    category = "",
    carbon = 0,
    description = "",
    imageSrc,
    imageAlt = "Action Image",
    className = ""
}) {
    const { toggleFavorites, isFavorite } = useFavorites();
    const [isProcessing, setIsProcessing] = useState(false);
    const { userId } = useAuth();

    const isActionFavorite = isFavorite(id);

    const handleToggleFavorite = async () => {
        if (isProcessing) return;

        try {
            setIsProcessing(true);
            
            const response = await toggleFavorites({ userId, actionId: id });
            console.log("Acción agregada a favoritos:", response);
            
        } catch (error) {
            toast.error("Error al cambiar favorito")
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div
            className={`rounded-[30px] shadow-md border lg:w-[348px] lg:h-[175px] flex items-center justify-around gap-4 p-4 bg-[#F1EDEC] text-[#005840] hover:opacity-85 hover:shadow-xl transition-all ${className}`}>
            <div className="flex-none">
                <Link to="">
                    <ImagePill
                        category={category}
                        imageSrc={imageSrc}
                        imageAlt={imageAlt}
                        size="sm"
                    />
                </Link>
            </div>

            <div className="flex">
                <Link to="">
                    <div className="mt-2 flex flex-col gap-1">
                        <p className="text-md font-medium my-1 line-clamp-2">{title}</p>

                        <span className="text-sm text-foreground/60 flex items-center gap-1">
                            <img src={CarbonIcon} alt="Dióxido de carbono" />
                            -{carbon} kg
                        </span>

                        <p className="text-small text-foreground/80 line-clamp-2">{description}</p>
                    </div>
                </Link>
                <button 
                    onClick={handleToggleFavorite}
                    disabled={isProcessing}
                    className="ml-2 p-1 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed self-start"
                >
                    {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-[#005840] loader"></div>
                    ) : (
                        <HeartIcon isFilled={isActionFavorite} />
                    )}
                </button>
            </div>
        </div>
    );
}