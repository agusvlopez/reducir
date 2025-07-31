import "./Goals.css";
import { useDisclosure } from "@heroui/react";
import { AppHeaderSection } from "../../components/Sections/AppHeader";
import { BaseModal } from "../../components/Base/BaseModal";
import { Heading } from "../../components/Base/Heading";
import InfoImage from "../../assets/icons/info.png";
import { Link } from "react-router";
import CarbonReduceIcon from "../../assets/icons/carbon-reduce.png";
import BaseButton from "../../components/Base/BaseButton";
import { useState } from "react";


export function Goals() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [customGoal, setCustomGoal] = useState(false);
    const [sliderValue, setSliderValue] = useState(70);

    const handleCustomGoal = () => setCustomGoal(!customGoal);

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
            <section className="max-w-[354px] mx-auto mt-[-70px] bg-[#F5F5F5] rounded-[30px] shadow-lg p-6 flex flex-col items-center gap-6">
                {/* Estadisticas: en BarLineChart */}

                <div>
                    <Heading tag="h3" size="h3" weight="semibold" align="left" color="green">Objetivo anual</Heading>
                    <p>El mínimo ideal es reducir un 10%. </p>
                </div>
                {customGoal ? (
                    <>
                        <div className="relative">
                            <span className="absolute top-[25%] left-[30%] text-lg font-semibold text-[#005840]">{sliderValue}%</span>
                            <img src={CarbonReduceIcon} alt="Reducción de dióxido de carbono" className="w-[93px] mx-auto" />
                        </div>
                        <BaseButton>
                            Establecer objetivo
                        </BaseButton>

                        {/* slider */}
                        <div className="w-full mt-4">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={sliderValue}
                                onChange={e => setSliderValue(Number(e.target.value))}
                                className="goals-slider"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="relative">
                            <span className="absolute top-[25%] left-[30%] text-xl font-semibold text-[#005840]">10%</span>
                            <img src={CarbonReduceIcon} alt="Reducción de dióxido de carbono" className="w-[93px] mx-auto" />
                        </div>
                        <BaseButton>
                            Reducir un 10%
                        </BaseButton>
                    </>
                )}
            </section>
            <section className="px-6 py-12 flex flex-col gap-6 items-center">

                <BaseButton
                    variant="outline"
                    className="mx-auto"
                    onClick={handleCustomGoal}>
                    {!customGoal ? "Reducción personalizada" : "Cambiar objetivo"}
                </BaseButton>


                <div className="text-center">
                    <p className="text-sm mb-3">Tenemos que reducir las emisiones a la mitad para 2030.</p>
                    <p className="text-sm">Si te propones reducir al menos un 10% al año, serás parte de este proyecto.</p>
                </div>
            </section>
        </>
    );
}