import { Link, useNavigate, useParams } from "react-router-dom";
import { Heading } from "../../components/Base/Heading";
import ACTIONS from "../../assets/data/greenSteps.actions.json";
import BaseButton from "../../components/Base/BaseButton";
import { HeartIcon } from "../../components/Icons/Heart";
import { PlusIcon } from "../../components/Icons/Plus";
import { CarbonIcon } from "../../components/Icons/Carbon";
import { ImagePill } from "../../components/Base/ImagePill";
import { ChevronLeft } from "../../components/Icons/ChevronLeft";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../../components/Base/Loader";
import { useAddAchievedActionMutation, useCheckAchievedActionQuery, useCheckSavedActionQuery, useToggleSavedActionMutation } from "../../api/actionsSlice";
import { toast } from "sonner";

export function Action() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { userId } = useAuth();
    //ESTO TAMBIEN LO USO EN ACTIONCARD, TODO: VER SI SIMPLIFICAR
    const [toggleSavedAction] = useToggleSavedActionMutation();
    
    const handleToggle = async () => {
        await toggleSavedAction({ 
            userId, 
            actionId: id 
        });
    }

      const { data: isActionSaved = false, isActionSavedLoading } = useCheckSavedActionQuery(
        { userId, actionId: id },
        { skip: !userId || !id }
      );

    const [ addAchievedAction ] = useAddAchievedActionMutation();

    const { data: isActionAchieved = false } = useCheckAchievedActionQuery(
        { userId, actionId: id },
        { skip: !userId || !id }
    );
    
    //buscar la acción por id en el archivo, por ahora
    //TODO: se llamará a la API para obtener la acción
    const action = ACTIONS.find(action => action._id === id);

    const handleAddToAchieved = async () => {
        console.log("agregando", action?.carbon, id, userId)
        const response = await addAchievedAction({ 
            userId, 
            actionId: id,
            carbon: action?.carbon
        });
        console.log("response", response);
        if(response?.data?.goalAchievement) {
            toast(response?.data?.goalAchievement?.message)
        }
    }

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
                        {isActionAchieved ? 'Reduciste' : 'Reducirás'} -{action?.carbon} kg
                    </span>

                </div>

                <div className="flex flex-col items-center gap-6 text-center mt-2">
                    {!isActionAchieved && (
                        isActionSavedLoading ? 
                        <Loader size="sm" color="green" />
                        :
                        <BaseButton 
                            onClick={handleToggle} 
                            className="w-full lg:w-[300px]" 
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
                    )}
                    <div className="flex items-center justify-center w-full">
                        <BaseButton 
                            onClick={handleAddToAchieved} 
                            isDisabled={isActionAchieved}
                            variant="outline" 
                            isArray={!isActionAchieved} 
                            className={`min-w-[280px] lg:w-[300px] ${isActionAchieved ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            {!isActionAchieved && <PlusIcon className="inline-block mr-2" />}
                            {isActionAchieved ? '¡Acción lograda!' : 'Marcar como completado'}
                        </BaseButton>
                        {isActionAchieved && (
                            // TODO: ACOMODAR COMO MANEJAR EL LINK, SI AGREGAR UNA RUTA DIRECTA A HACER EL POST
                            <Link 
                                className="flex-1 flex justify-end pl-4 font-semibold text-dark-green cursor-pointer"
                                to={`/app/community`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}