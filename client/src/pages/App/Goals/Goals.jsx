import "./Goals.css";
import { useDisclosure } from "@heroui/react";
import { AppHeaderSection } from "../../../components/Sections/AppHeader";
import { BaseModal } from "../../../components/Base/BaseModal";
import { Heading } from "../../../components/Base/Heading";
import InfoImage from "../../../assets/icons/info.png";
import { Link } from "react-router-dom";
import CarbonReduceIcon from "../../../assets/icons/carbon-reduce.png";
import BaseButton from "../../../components/Base/BaseButton";
import { useGetUserQuery } from "../../../api/apiSlice";
import { useAuth } from "../../../hooks/useAuth";
import FlipCard from "../../../components/Cards/FlipCard.jsx";
import { GoalsProvider } from "../../../context/GoalsContext.jsx";
import { useGoals } from "../../../hooks/useGoals.js";
import { getGoalProgressInfo } from "../../../helpers/getGoalProgress.js";
import { useEffect } from "react";


function GoalsContent() {
    const { userId } = useAuth();
    const { data: userData } = useGetUserQuery(userId);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
        <>
            <BaseModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title="¿Qué son las metas?"
            >
            {/* DESCRIPCION DE LAS EMISIONES */}
            </BaseModal>
            <AppHeaderSection>
                <div className="flex flex-col gap-3">
                    <span className="flex gap-4 items-center">
                        <Link to="/app/emissions">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </Link>
                        <span className="flex gap-3 items-center">
                            <Heading tag="h2" size="h2" weight="semibold" align="left">Establecé una meta</Heading>
                            <button
                                onClick={onOpen}
                            >
                                <img src={InfoImage} alt="Información de las acciones" className="h-fit" />
                            </button>
                        </span>
                    </span>
                    <p className="">Establecé un objetivo para reducir emisiones. Establecé el que estas dispuesto a cumplir. ¡Podés cambiarlo cuando quieras!</p>
                </div>
            </AppHeaderSection>

            {/* CARD */}
            <section className="max-w-[354px] mx-auto mt-[-70px] rounded-[30px] flex flex-col items-center gap-6">
                <FlipCard 
                    customGoal={customGoal}
                    goalSelectedPercentage={userData?.carbonGoal?.targetReductionPercentage}
                    goalProgress={goalInfo?.progressPercentage}
                />
            </section>

            <section className="px-6 py-12 flex flex-col gap-6 items-center">
                <div className="text-center font-medium">
                    <p className="mb-3">Tenemos que reducir las emisiones a la mitad para 2030.</p>
                    <p className="">Si te propones reducir al menos un 10% al año, serás parte de este proyecto.</p>
                </div>
            </section>
        </>
    );
}

export function Goals() {
    return (
        <GoalsProvider>
            <GoalsContent />
        </GoalsProvider>
    )
}