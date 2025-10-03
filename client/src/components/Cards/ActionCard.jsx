import { Link } from "react-router-dom";
import { HeartIcon } from "../Icons/Heart";
import CarbonIcon from "../../assets/icons/carbon-green.png";
import { ImagePill } from "../Base/ImagePill.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useActionsSaved } from "../../hooks/useActionsSaved.js";
import { useActionsSavedStatus } from "../../hooks/useActionsSavedStatus.js";

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
    const { userId } = useAuth();
    //ESTO TAMBIEN LO USO EN ACTION, TODO: VER SI SIMPLIFICAR
    const { toggleAction } = useActionsSaved();
    const { isActionSaved, isLoading } = useActionsSavedStatus(id);
    
    const handleToggle = async () => {
        await toggleAction({ 
            userId, 
            actionId: id 
        });
    }

    return (
        <div
            className={`rounded-[30px] shadow-md border lg:w-[348px] lg:h-[175px] flex items-center justify-around gap-4 p-4 bg-[#F1EDEC] text-[#005840] hover:opacity-85 hover:shadow-xl transition-all ${className}`}>
            <div className="flex-none">
                {/* El link ahora apunta a la página de detalle de la acción */}
                <Link to={`/app/actions/${id}`}>
                    <ImagePill
                        category={category}
                        imageSrc={imageSrc}
                        imageAlt={imageAlt}
                        size="sm"
                    />
                </Link>
            </div>
            <div className="flex">
                {/* El link ahora apunta a la página de detalle de la acción */}
                <Link to={`/app/actions/${id}`}>
                    <div className="mt-2 flex flex-col gap-1">
                        <p className="text-md font-medium my-1 line-clamp-2">{title}</p>

                        <span className="text-sm text-foreground/60 flex items-center gap-1">
                            <img src={CarbonIcon} alt="Dióxido de carbono" />
                            -{carbon} kg
                        </span>

                        <p className="text-small text-foreground/80 line-clamp-2">{description}</p>
                    </div>
                </Link>
                <button>
                    <HeartIcon isFilled={isActionSaved} handleClick={handleToggle} isLoading={isLoading} />
                </button>
            </div>
        </div>
    );
}