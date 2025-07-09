import { BaseCard } from "../../components/Base/BaseCard";
import { Heading } from "../../components/Base/Heading";
import { Pill } from "../../components/Base/Pill";
import { AppHeaderSection } from "../../components/Sections/AppHeader";
import LedImage from "../../assets/led.png";
import PlantImage from "../../assets/plant.png";
import QuestionIcon from "../../assets/icons/question.png";
import { BaseModal } from "../../components/Base/BaseModal";
import { useDisclosure } from "@heroui/react";

export function Emissions() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                            <img src={QuestionIcon} alt="Información de las acciones" className="h-fit" />
                        </button>
                    </span>
                    <p className="">Toneladas anuales de contaminación (CO2e)</p>
                    <Pill
                        text="Tu objetivo: Reducir un 10% las emisiones anuales (CO2)" className="font-medium"
                        color="orange"
                        size="sm"
                    />
                </div>
            </AppHeaderSection>
            <section className="max-w-[354px] h-[182px] mx-auto mt-[-70px] bg-[#F5F5F5] rounded-[30px] shadow-lg p-4 flex justify-between items-center">
                {/* Estadisticas: en BarLineChart */}
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
                />
            </section>
        </>
    );
}