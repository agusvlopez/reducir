import { BaseCard } from "../../components/Base/BaseCard";
import { Heading } from "../../components/Base/Heading";
import { Pill } from "../../components/Base/Pill";
import { AppHeaderSection } from "../../components/Sections/AppHeader";
import LedImage from "../../assets/led.png";
import PlantImage from "../../assets/plant.png";
import { BaseModal } from "../../components/Base/BaseModal";
import { useDisclosure } from "@heroui/react";
import { useGetUserQuery } from "../../api/apiSlice";
import { useAuth } from "../../hooks/useAuth";
import { GoalProgressCard } from "../../components/Cards/GoalProgressCard";
import { Loader } from "../../components/Base/Loader";
import ButtonLink from "../../components/Base/ButtonLink";
import GoalStatusCard from "../../components/Cards/GoalStatusCard";


export function Emissions() {
    const { userId } = useAuth();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { data: userData, isLoading: isUserLoading, isError: isUserError } = useGetUserQuery(userId, { skip: !userId });

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <BaseModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title="¿Qué son las emisiones?"
            >
                {/* DESCRIPCION DE LAS EMISIONES */}
            </BaseModal>

            {/* Header con color de marca */}
            <AppHeaderSection>
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3">
                        <span className="flex gap-2 items-center">
                            <Heading 
                                tag="h2" 
                                weight="medium" 
                                align="left" 
                                variant="headline" 
                                className="text-white"
                            >
                                Mis emisiones
                            </Heading>
                            <button
                                onClick={onOpen}
                                className="hover:opacity-80 transition-opacity"
                                aria-label="Información sobre emisiones"
                            >
                                <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="15" r="12" fill="#ED6C1D"/>
                                    <path d="M13.272 22.536C13.272 22.952 13.136 23.304 12.864 23.592C12.592 23.864 12.248 24 11.832 24C11.416 24 11.072 23.864 10.8 23.592C10.528 23.304 10.392 22.952 10.392 22.536V12.624C10.392 12.208 10.528 11.864 10.8 11.592C11.072 11.304 11.416 11.16 11.832 11.16C12.248 11.16 12.592 11.304 12.864 11.592C13.136 11.864 13.272 12.208 13.272 12.624V22.536ZM11.808 9.6C11.264 9.6 10.88 9.512 10.656 9.336C10.432 9.16 10.32 8.848 10.32 8.4V7.944C10.32 7.48 10.44 7.168 10.68 7.008C10.936 6.832 11.32 6.744 11.832 6.744C12.392 6.744 12.784 6.832 13.008 7.008C13.232 7.184 13.344 7.496 13.344 7.944V8.4C13.344 8.864 13.224 9.184 12.984 9.36C12.744 9.52 12.352 9.6 11.808 9.6Z" fill="white"/>
                                </svg>
                            </button>
                        </span>
                        <p className="text-white text-sm lg:text-base">
                            Toneladas anuales de contaminación (CO2e)
                        </p>
                    </div>
                </div>
            </AppHeaderSection>

            {/* Contenedor principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                
                {/* Card de objetivo - Destacado */}
                <section className="mb-8 lg:mb-12">
                    <GoalStatusCard 
                        userData={userData}
                    />
                </section>

                {/* Cards de acciones - Layout mejorado para desktop */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-5xl mx-auto">
                    <div className="transform transition-transform hover:scale-[1.02]">
                        <BaseCard
                            title="Establecé una meta"
                            subtitle="Elegí un objetivo para reducir tu huella"
                            imageSrc={PlantImage}
                            imageAlt=""
                            labelButton="Comenzar"
                            color="green"
                            link="/app/emissions/goals"
                        />
                    </div>
                    
                    <div className="transform transition-transform hover:scale-[1.02]">
                        <BaseCard
                            title="Perfil de emisiones"
                            subtitle="Rehacer Test de huella de carbono"
                            imageSrc={LedImage}
                            imageAlt=""
                            labelButton="Rehacer Test"
                            color="white"
                            isReverse={true}
                            link="/test/intro"
                        />
                    </div>
                </section>

                {/* Sección adicional opcional - Información contextual */}
                <section className="mt-12 max-w-5xl mx-auto">
                    <div className="bg-white rounded-[30px] shadow-sm p-6 lg:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {/* Tip 1 */}
                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#005840]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#005840]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Reduce tu consumo
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Cada pequeña acción cuenta para reducir tu huella de carbono
                                </p>
                            </div>

                            {/* Tip 2 */}
                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#005840]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#005840]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Seguí tu progreso
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Monitoreá tus metas y celebrá cada logro alcanzado
                                </p>
                            </div>

                            {/* Tip 3 */}
                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#005840]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#005840]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Inspirá a otros
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Compartí tus logros y motivá a tu comunidad
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}