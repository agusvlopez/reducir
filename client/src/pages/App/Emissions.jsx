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

export function Emissions() {
    const { userId } = useAuth();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { data: userData, isLoading: isUserLoading } = useGetUserQuery(userId, { skip: !userId });

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title="¿Qué son las emisiones?"
            >
                {/* DESCRIPCION DE LAS EMISIONES */}
            </BaseModal>
            <AppHeaderSection>
                <div className="flex flex-col gap-3">
                    <span className="flex gap-2 items-center">
                        <Heading tag="h2" size="h2" weight="semibold" align="left">Mis emisiones</Heading>
                        <button
                            onClick={onOpen}
                        >
                            <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="15" r="12" fill="#ED6C1D"/>
                            <path d="M13.272 22.536C13.272 22.952 13.136 23.304 12.864 23.592C12.592 23.864 12.248 24 11.832 24C11.416 24 11.072 23.864 10.8 23.592C10.528 23.304 10.392 22.952 10.392 22.536V12.624C10.392 12.208 10.528 11.864 10.8 11.592C11.072 11.304 11.416 11.16 11.832 11.16C12.248 11.16 12.592 11.304 12.864 11.592C13.136 11.864 13.272 12.208 13.272 12.624V22.536ZM11.808 9.6C11.264 9.6 10.88 9.512 10.656 9.336C10.432 9.16 10.32 8.848 10.32 8.4V7.944C10.32 7.48 10.44 7.168 10.68 7.008C10.936 6.832 11.32 6.744 11.832 6.744C12.392 6.744 12.784 6.832 13.008 7.008C13.232 7.184 13.344 7.496 13.344 7.944V8.4C13.344 8.864 13.224 9.184 12.984 9.36C12.744 9.52 12.352 9.6 11.808 9.6Z" fill="white"/>
                            </svg>
                        </button>
                    </span>
                    <p>Toneladas anuales de contaminación (CO2e)</p>
                </div>
            </AppHeaderSection>
            <section className="max-w-[354px] h-fit mx-auto mt-[-70px] bg-[#F5F5F5] rounded-[30px] shadow-lg p-4 flex justify-between items-center">
                <GoalProgressCard 
                    targetReductionPercentage={userData?.carbonGoal?.targetReductionPercentage}
                    baselineValue={userData?.carbonGoal?.baselineValue}
                    targetValue={userData?.carbonGoal?.targetValue}
                    currentCarbon={userData?.carbon}
                    startDate={userData?.carbonGoal?.startDate}
                    year={userData?.carbonGoal?.year}
                />
            </section>
            <section className="mx-auto py-8 flex flex-col gap-4 items-center justify-center">
                <BaseCard
                    title="Establecé una meta"
                    subtitle="Elegí un objetivo para reducir tu huella"
                    imageSrc={PlantImage}
                    imageAlt=""
                    labelButton="Comenzar"
                    color="green"
                    link="/app/emissions/goals"
                />
                <BaseCard
                    title="Perfil de emisiones"
                    subtitle="Rehacer Test de huella de carbono"
                    imageSrc={LedImage}
                    imageAlt=""
                    labelButton="Rehacer Test"
                    color="white"
                    isReverse={true}
                    className=""
                    link="/test/intro"
                />
            </section>
        </>
    );
}