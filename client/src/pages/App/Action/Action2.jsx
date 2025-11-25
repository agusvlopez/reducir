import { Link, useNavigate, useParams } from "react-router-dom";
import { Heading } from "../../../components/Base/Heading";
import ACTIONS from "../../../assets/data/actions.json";
import BaseButton from "../../../components/Base/BaseButton";
import { HeartIcon } from "../../../components/Icons/Heart";
import { PlusIcon } from "../../../components/Icons/Plus";
import { CarbonIcon } from "../../../components/Icons/Carbon";
import { ImagePill } from "../../../components/Base/ImagePill";
import { ChevronLeft } from "../../../components/Icons/ChevronLeft";
import { useAuth } from "../../../hooks/useAuth";
import { Loader } from "../../../components/Base/Loader";
import { useAddAchievedActionMutation, useAddActionToAchievedMutation, useCheckAchievedActionQuery, useCheckActionProgressQuery, useCheckSavedActionQuery, useToggleSavedActionMutation, useUpdateActionProgressMutation } from "../../../api/actionsSlice";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import debounce from "just-debounce-it";
import { frequencyOptions, frequencyToChecks } from "../../../constants/frequencyActions";


export function Action() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { userId } = useAuth();
    
    const [frequency, setFrequency] = useState('EveryDay');
    const [checkedDays, setCheckedDays] = useState([]);
    const [isActionAddedToHabit, setIsActionAddedToHabit] = useState(false);
    const [isActionAchieved, setIsActionAchieved] = useState(false);
    
    const [toggleSavedAction] = useToggleSavedActionMutation();
    const [addActionToAchieved] = useAddActionToAchievedMutation();
    const [updateActionProgress] = useUpdateActionProgressMutation();
    

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
    const { data: progressResult } = useCheckActionProgressQuery(
        { userId, actionId: id },
        { skip: !userId || !id }
    );

    useEffect(() => {
        if (progressResult) {
            const { frequency: fetchedFrequency, progress: fetchedProgress } = progressResult;
            
            if (fetchedFrequency) {
                setFrequency(fetchedFrequency);
            }

            if (fetchedProgress !== undefined) {
                const maxChecksForFrequency = frequencyToChecks[fetchedFrequency] || 30;
                const numCheckedDays = Math.round((fetchedProgress / 100) * maxChecksForFrequency);
                const newCheckedDays = Array.from({ length: numCheckedDays }, (_, i) => i);
                setCheckedDays(newCheckedDays);
            }
        }
    }, [progressResult]);
     

    const [ addAchievedAction ] = useAddAchievedActionMutation();

    
    const action = ACTIONS.find(action => action._id === id);

    const handleAddNewHabit = async () => {
        setFrequency('EveryDay');
        setCheckedDays([]);
        setIsActionAddedToHabit(!isActionAddedToHabit);       
    }

    const handleAddToAchieved = async () => {
        console.log("handleAddToAchieved");

        const response = await addActionToAchieved({   
            userId,
            actionId: action?._id,
            carbon: action?.carbon,
            frequency: frequency,
            progress: progressPercentage
        });
                    
        console.log("response", response);
        

        setIsActionAchieved(true);
    }

    const goBack = () => {
        navigate(-1);
    }


    const maxChecks = 30;
    const maxChecksByFrequency = frequencyToChecks[frequency];
    const progressPercentage = (checkedDays.length / maxChecksByFrequency) * 100;

    const debouncedUpdateProgressRef = useRef(null);
    
    
    const handleCheckToggle = (index) => {
        const newCheckedDays = checkedDays.includes(index)
            ? checkedDays.filter(i => i !== index)
            : [...checkedDays, index];
        
        setCheckedDays(newCheckedDays);
        
        const progressPercentage = Math.round((newCheckedDays.length / maxChecks) * 100);
        
        if (debouncedUpdateProgressRef.current) {
            debouncedUpdateProgressRef.current(id, userId, progressPercentage);
        }
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
                                        onClick={handleAddNewHabit} 
                                        variant="outline" 
                                        isArray={!isActionAddedToHabit} 
                                        className={`flex-1`}
                                    >
                                        {isActionAchieved && <PlusIcon className="inline-block mr-2" />}
                                        <span className="text-base font-semibold">{isActionAddedToHabit ? 'Agregar esta acción como hábito' : 'Elegí la frecuencia en la cual lo harás' }</span>
                                    </BaseButton>
                                    
                                    {/* {isActionAddedToHabit && (
                                        <Link 
                                            className="flex-shrink-0 w-12 h-12 bg-[#005840] hover:bg-[#004433] rounded-[30px] flex items-center justify-center text-white transition-colors group"
                                            to={`/app/community/post/new?actionId=${id}`}
                                            title="Compartir en comunidad"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                            </svg>
                                        </Link>
                                    )} */}
                                </div>
                                {/*                             
                                {isActionAchieved && (
                                    <p className="text-gray-500 mt-3 text-center">
                                        ¡Compartí tu logro con la comunidad! 🌱
                                    </p>
                                )} */}
                            </div>

                        
                        {/* Selector de frecuencia */}
                        {!isActionAddedToHabit && (
                            <div className="bg-white rounded-[30px] shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    ¿Con qué frecuencia lo harás?
                                </h3>
                                <div className="space-y-3">
                                    {frequencyOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setFrequency(option.value);
                                                setCheckedDays([]);
                                            }}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                                                frequency === option.value
                                                    ? 'border-[#005840] bg-[#005840]/5 shadow-sm'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <span className="text-2xl">{option.icon}</span>
                                            <span className={`flex-1 text-left font-medium ${
                                                frequency === option.value 
                                                    ? 'text-[#005840]' 
                                                    : 'text-gray-700'
                                            }`}>
                                                {option.label}
                                            </span>
                                            {frequency === option.value && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#005840]">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Tracker de progreso */}
                        {!isActionAddedToHabit && (
                            <div className="bg-white rounded-[30px] shadow-sm p-6">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Progreso este mes
                                        </h3>
                                        <span className="text-sm font-medium text-[#005840]">
                                            {checkedDays.length} / {maxChecksByFrequency}
                                        </span>
                                    </div>
                                    
                                    {/* Barra de progreso */}
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-[#005840] to-[#007a5a] h-full rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Grid de checks */}
                                <div className="grid grid-cols-7 gap-2 mb-4">
                                    {Array.from({ length: maxChecks }).map((_, index) => {
                                        const isChecked = checkedDays?.includes(index);
                                        console.log("grid de checks");
                                        
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleCheckToggle(index)}
                                                className={`aspect-square rounded-2xl border-2 transition-all duration-200 flex items-center justify-center ${
                                                    isChecked
                                                        ? 'border-[#005840] bg-[#005840] text-white shadow-md scale-105'
                                                        : 'border-gray-300 hover:border-[#005840] hover:bg-[#005840]/5'
                                                }`}
                                                aria-label={`Día ${index + 1}`}
                                            >
                                                {isChecked ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-xs font-medium text-gray-400">
                                                        {index + 1}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Mensaje de progreso */}
                                {checkedDays.length > 0 && (
                                    <div className={`p-4 rounded-2xl ${
                                        checkedDays.length === maxChecksByFrequency
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-blue-50 border border-blue-200'
                                    }`}>
                                        <p className={`text-sm font-medium ${
                                            checkedDays.length === maxChecksByFrequency
                                                ? 'text-green-800'
                                                : 'text-blue-800'
                                        }`}>
                                            {checkedDays.length > maxChecksByFrequency
                                                && '¡Wow! 🎉 Estas haciendo mas de lo esperado'
                                            }
                                            {checkedDays.length === maxChecksByFrequency
                                                && '¡Excelente! 🎉 Completaste tu objetivo esta semana'
                                            }
                                            {checkedDays.length < maxChecksByFrequency
                                                && `¡Vas muy bien! Te faltan ${maxChecksByFrequency - checkedDays.length} ${maxChecksByFrequency - checkedDays.length === 1 ? 'vez' : 'veces'} más`
                                            }

                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Botón de completar */}
                        {!isActionAddedToHabit && (
                            <div className="bg-white rounded-[30px] shadow-sm p-6">
                                <button
                                    onClick={handleAddToAchieved}
                                    disabled={checkedDays.length === 0}
                                    className={`w-full py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-200 ${
                                        checkedDays.length > 0
                                            ? 'bg-[#005840] text-white hover:bg-[#004433] shadow-md hover:shadow-lg'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {checkedDays.length === 0 
                                        ? 'Marca al menos 1 día para continuar'
                                        : checkedDays.length === maxChecksByFrequency
                                        ? '¡Completar acción! 🎉'
                                        : `Guardar progreso (${checkedDays.length}/${maxChecks})`
                                    }
                                </button>
                                
                                {checkedDays.length > 0 && checkedDays.length < maxChecks && (
                                    <p className="text-center text-sm text-gray-500 mt-3">
                                        Podés guardar tu progreso parcial y continuar después
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Mensaje de completado */}
                        {isActionAchieved && (
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-[30px] shadow-lg p-8 text-white text-center">
                                <div className="text-6xl mb-4">🎉</div>
                                <h2 className="text-2xl font-bold mb-2">¡Acción completada!</h2>
                                <p className="text-green-100 mb-4">
                                    Completaste esta acción {checkedDays.length} {checkedDays.length === 1 ? 'vez' : 'veces'}
                                </p>
                                <button className="bg-white text-green-600 px-6 py-3 rounded-2xl font-semibold hover:bg-green-50 transition-colors">
                                    Compartir en comunidad 🌱
                                </button>
                            </div>
                        )}
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