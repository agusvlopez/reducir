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
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
        {/* Header con información de la acción */}
        <div className="bg-[#005840] text-white rounded-b-[30px] lg:rounded-b-[40px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="flex items-start gap-4 lg:gap-6">
                    <button 
                        onClick={goBack}
                        className="pt-1 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                        aria-label="Volver"
                    >
                        <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7" stroke={2} />
                    </button>
                    <div className="flex-1">
                        <Heading 
                            tag="h2" 
                            weight="medium" 
                            align="left" 
                            variant="headline" 
                            className="text-white"
                        >
                            {action?.title}
                        </Heading>
                        <p className="text-white/90 text-sm lg:text-base leading-relaxed max-w-3xl">
                            {action?.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            
            {/* Layout de 2 columnas en desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* Columna izquierda - Imagen */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="w-full max-w-[356px] lg:mt-[-70px]">
                        <div className="bg-white rounded-[30px] shadow-xl overflow-hidden aspect-square">
                            <ImagePill
                                category={action?.category}
                                imageSrc={action?.image?.url}
                                imageAlt={action?.title}
                            />
                        </div>
                    </div>
                </div>

                {/* Columna derecha - Información y acciones */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                    
                    {/* Card de impacto de carbono */}
                    <div className="bg-white rounded-[30px] shadow-sm p-6 lg:p-8 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-[#005840]/10 rounded-full flex items-center justify-center">
                                <CarbonIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">
                                    {isActionAchieved ? 'Impacto logrado' : 'Impacto potencial'}
                                </p>
                                <p className="text-2xl font-bold text-[#005840]">
                                    -{action?.carbon} kg CO₂
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                            {isActionAchieved 
                                ? '¡Felicitaciones! Ya redujiste esta cantidad de emisiones.' 
                                : 'Al completar esta acción, reducirás esta cantidad de emisiones.'}
                        </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-4">
                        {/* Botón de favoritos */}
                        {!isActionAchieved && (
                            <div className="bg-white rounded-[30px] shadow-sm p-2">
                                {isActionSavedLoading ? (
                                    <div className="flex justify-center py-4">
                                        <Loader size="sm" color="green" />
                                    </div>
                                ) : (
                                    <BaseButton 
                                        onClick={handleToggle} 
                                        className="w-full" 
                                        isArray={false}
                                        variant={isActionSaved ? 'white' : 'green'}
                                    >
                                        <HeartIcon 
                                            className={`inline-block mr-2 ${isActionSaved ? 'text-[#005840]' : ''}`} 
                                            isFilled={isActionSaved} 
                                        />
                                        {isActionSaved ? 'Quitar de mis favoritos' : 'Agregar a mis favoritos'}
                                    </BaseButton>
                                )}
                            </div>
                        )}

                        {/* Botón de completar/compartir */}
                        <div className="bg-white rounded-[30px] shadow-sm p-6">
                            <div className="flex items-center gap-4">
                                <BaseButton 
                                    onClick={handleAddToAchieved} 
                                    isDisabled={isActionAchieved}
                                    variant="outline" 
                                    isArray={!isActionAchieved} 
                                    className={`flex-1 ${isActionAchieved ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {!isActionAchieved && <PlusIcon className="inline-block mr-2" />}
                                    {isActionAchieved ? '¡Acción lograda!' : 'Marcar como completado'}
                                </BaseButton>
                                
                                {isActionAchieved && (
                                    <Link 
                                        className="flex-shrink-0 w-12 h-12 bg-[#005840] hover:bg-[#004433] rounded-[30px] flex items-center justify-center text-white transition-colors group"
                                        to={`/app/community`}
                                        title="Compartir en comunidad"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                            
                            {isActionAchieved && (
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    ¡Compartí tu logro con la comunidad! 🌱
                                </p>
                            )}
                        </div>

                        {/* Tips adicionales (opcional) */}
                        <div className="bg-gradient-to-br from-[#005840] to-[#007a5a] rounded-[30px] shadow-sm p-6 text-white">
                            <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 flex-shrink-0 mt-0.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Consejo para comenzar
                                    </h3>
                                    <p className="text-sm text-white/90 leading-relaxed">
                                        {!isActionAchieved 
                                            ? 'Empezá de a poco y convertí esta acción en un hábito diario. Cada pequeño paso cuenta.' 
                                            : '¿Ya pensaste en la próxima acción? Seguí sumando para aumentar tu impacto positivo.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}