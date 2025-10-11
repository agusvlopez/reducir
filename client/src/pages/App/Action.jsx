import { useNavigate, useParams } from "react-router-dom";
import { Heading } from "../../components/Base/Heading";
import ACTIONS from "../../assets/data/greenSteps.actions.json";
import BaseButton from "../../components/Base/BaseButton";
import { HeartIcon } from "../../components/Icons/Heart";
import { PlusIcon } from "../../components/Icons/Plus";
import { CarbonIcon } from "../../components/Icons/Carbon";
import { ImagePill } from "../../components/Base/ImagePill";
import { ChevronLeft } from "../../components/Icons/ChevronLeft";
import { useAuth } from "../../hooks/useAuth";
import { useActionsSaved } from "../../hooks/useActionsSaved";
import { useActionsSavedStatus } from "../../hooks/useActionsSavedStatus";
import { Loader } from "../../components/Base/Loader";

export function Action() {
    const navigate = useNavigate();

    const { id } = useParams();
    const { userId } = useAuth();
    //ESTO TAMBIEN LO USO EN ACTIONCARD, TODO: VER SI SIMPLIFICAR
    const { toggleAction } = useActionsSaved();
    const { isActionSaved, isLoading } = useActionsSavedStatus(id);
    
    const handleToggle = async () => {
        await toggleAction({ 
            userId, 
            actionId: id 
        });
    }

    //buscar la acción por id en el archivo, por ahora
    //TODO: se llamara a la API para obtener la acción
    const action = ACTIONS.find(action => action._id === id);

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className="flex flex-col mb-8">
            <div className="flex flex-col justify-center h-full bg-[#005840] text-white p-6 pb-24 rounded-b-[30px]">
                <div className="flex items-center gap-4">
                    <button onClick={goBack}><ChevronLeft className="w-6 h-6 cursor-pointer" stroke={2} /></button>
                    <Heading tag="h2" size="h2" weight="semibold" align="left">{action?.title}</Heading>
                </div>
                <p className="mt-4">{action?.description}</p>
            </div>
            <section className="w-5/6 max-w-[356px] mx-auto flex flex-col items-center justify-center gap-4 pt-0">
                {/* imagen  */}
                <div className="h-[356px] mx-auto mt-[-70px] bg-[#F5F5F5] rounded-[30px] shadow-lg overflow-hidden p-0">
                    <ImagePill
                        category={action?.category}
                        imageSrc={action?.image?.url}
                        imageAlt={action?.title}
                    />
                </div>

                <div className="w-full flex items-center justify-end gap-2 text-[#005840] font-semibold">
                    <CarbonIcon className="inline-block" />
                    <span>
                        Reducirás -{action?.carbon} kg
                    </span>

                </div>

                <div className="flex flex-col items-center gap-6 text-center mt-2">
                    {isLoading ? 
                        <Loader size="sm" color="green" />
                        :
                        <BaseButton 
                            onClick={handleToggle} 
                            className="w-full max-w-[300px]" 
                            isArray={false}
                            variant={isActionSaved ? 'white' : 'green'}
                        >
                            {/* TODO: VER COMO ARREGLAR Q SE VACIE CUANDO NO ESTA MARCADO Y VICEVERSA */}
                            <HeartIcon 
                                className={`inline-block mr-2 ${isActionSaved ? 'text-[#005840]' : ''}`} 
                                isFilled={isActionSaved} 
                            />
                        {isActionSaved ? 'Quitar de mis favoritos' : 'Agregar a mis favoritos'}
                        </BaseButton>  
                    }
                    <BaseButton variant="outline" className="w-full max-w-[300px]">
                        <PlusIcon className="inline-block mr-2" />
                        Marcar como completado
                    </BaseButton>
                </div>
            </section>
        </div>
    )
}