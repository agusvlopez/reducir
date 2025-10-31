import "./Goals.css";
import { useDisclosure } from "@heroui/react";
import { AppHeaderSection } from "../../../components/Sections/AppHeader";
import { BaseModal } from "../../../components/Base/BaseModal";
import { Heading } from "../../../components/Base/Heading";
import { Link } from "react-router-dom";
import { useGetUserQuery } from "../../../api/apiSlice";
import { useAuth } from "../../../hooks/useAuth";
import FlipCard from "../../../components/Cards/FlipCard.jsx";
import { GoalsProvider } from "../../../context/GoalsContext.jsx";
import { useGoals } from "../../../hooks/useGoals.js";
import { getGoalProgressInfo } from "../../../helpers/getGoalProgress.js";
import { useEffect } from "react";
import { Loader } from "../../../components/Base/Loader.jsx";
import ButtonLink from "../../../components/Base/ButtonLink.jsx";


function GoalsContent() {
    const { userId } = useAuth();
    const { data: userData, isLoading: isUserLoading, isError: isUserError} = useGetUserQuery(userId);
    const { isOpen, _onOpen, onOpenChange } = useDisclosure();
    const { customGoal, setSliderValue } = useGoals();

    const goalInfo = getGoalProgressInfo({
        baselineValue: userData?.carbonGoal?.baselineValue,
        targetReductionPercentage: userData?.carbonGoal?.targetReductionPercentage,
        targetValue: userData?.carbonGoal?.targetValue,
        currentCarbon: userData?.carbon,
        startDate: userData?.carbonGoal?.startDate,
        year: userData?.carbonGoal?.year
    });
    
    useEffect(() => {
        if (userData) {
            const targetReduction = userData.carbonGoal?.targetReductionPercentage ?? 0;
            setSliderValue(targetReduction);
        }
    }, [userData, setSliderValue]);

return (
    <div className="min-h-screen bg-[#F5F5F5]">
        <BaseModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="¿Qué son las metas?"
        >
            {/* DESCRIPCION DE LAS EMISIONES */}
        </BaseModal>

        {/* Header con navegación */}
        <AppHeaderSection>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-3">
                    <span className="flex gap-4 items-center">
                        <Link 
                            to="/app/emissions"
                            className="hover:opacity-80 transition-opacity"
                            aria-label="Volver a emisiones"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </Link>
                        <span className="flex gap-3 items-center">
                            <Heading 
                                tag="h2" 
                                weight="medium" 
                                align="left" 
                                variant="headline" 
                                className="text-white"
                            >
                                Establecé una meta
                            </Heading>
                        </span>
                    </span>
                    <p className="text-white text-sm lg:text-base lg:max-w-2xl">
                        Establecé un objetivo para reducir emisiones, el que estés dispuesto a cumplir. ¡Podés cambiarlo cuando quieras!
                    </p>
                </div>
            </div>
        </AppHeaderSection>

        {/* Contenedor principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Layout de 2 columnas en desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-8 lg:py-10">
                
                {/* Columna izquierda - FlipCard */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end items-start">
                    <div className="w-full max-w-[354px] lg:max-w-[400px] lg:mt-[-100px]">
                        {isUserLoading && (
                            <div className="flex justify-center py-12">
                                <Loader />
                            </div>
                        )}
                        {isUserError && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                                Error al cargar los datos del usuario.
                            </div>
                        )}
                        {!isUserLoading && !isUserError && (
                            <FlipCard 
                                customGoal={customGoal}
                                goalSelectedPercentage={userData?.carbonGoal?.targetReductionPercentage}
                                goalProgress={goalInfo?.progressPercentage}
                            />
                        )}
                    </div>
                </div>

                {/* Columna derecha - Información y contexto */}
                <div className="lg:col-span-7 flex flex-col justify-center gap-8">
                    
                    {/* Mensaje principal */}
                    <div className="bg-white rounded-[30px] shadow-sm p-6 lg:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#005840]/10 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#005840]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Un compromiso con el planeta
                                </h3>
                                <p className="text-gray-700 mb-3 leading-relaxed">
                                    Tenemos que reducir las emisiones a la mitad para 2030.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Si te proponés reducir al menos un <strong className="text-[#005840]">10% al año</strong>, serás parte de este proyecto global.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cards de beneficios */}
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white rounded-[30px] shadow-sm p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm">
                                    Seguimiento claro
                                </h4>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Monitoreá tu progreso y visualizá tu impacto real
                            </p>
                        </div>

                        <div className="bg-white rounded-[30px] shadow-sm p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm">
                                    Flexibilidad total
                                </h4>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Ajustá tu meta cuando lo necesites sin restricciones
                            </p>
                        </div>
                    </div> */}

                    {/* Call to action adicional */}
                    <div className="bg-gradient-to-r from-[#005840] to-[#007a5a] rounded-[30px] shadow-sm p-6 text-white">
                        <div className="flex items-start gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 flex-shrink-0 mt-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                            </svg>
                            <div>
                                <h4 className="font-semibold mb-2">
                                    ¿Necesitás inspiración?
                                </h4>
                                <p className="text-sm text-white/90 leading-relaxed">
                                    Explorá acciones concretas que te ayudarán a alcanzar tu meta de reducción de emisiones.
                                </p>
                                <div className="flex justify-end pr-4">
                                    <ButtonLink
                                        to="/app/actions"
                                        variant="outlined"
                                        className="text-white px-0"  
                                    >
                                        Explorar acciones
                                    </ButtonLink>
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

export function Goals() {
    return (
        <GoalsProvider>
            <GoalsContent />
        </GoalsProvider>
    )
}