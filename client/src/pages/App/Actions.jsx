import debounce from "just-debounce-it";
import { useCallback, useState } from "react";
import { Heading } from "../../components/Base/Heading";
import { Pill } from "../../components/Base/Pill";
import { ActionCard } from "../../components/Cards/ActionCard";
import { Search } from "../../components/Inputs/Search";
import { Select } from "../../components/Inputs/Select";
import ACTIONS from "../../assets/data/actions.json";
import InfoImage from "../../assets/icons/info.png";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";
import { BaseModal } from "../../components/Base/BaseModal";

export function Actions() {
    


    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [category, setCategory] = useState("");

    const handleSelectCategory = (selectedValue) => {
        setCategory(selectedValue);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearch = useCallback(
        debounce((query) => {
            setSearchQuery(query);
        }, 1000),
        []
    );

    const filteredActions = ACTIONS?.filter(
        (action) =>
            (!category || action.category === category) &&
            (!searchQuery || action.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <BaseModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    title="¿Qué son las acciones?">
                    <p className="text-[#383838] font-medium">
                        ¡Observá todos los tips y empezá a hacer la acción que quieras!
                    </p>
                    <p className="text-[#383838] font-medium">
                        Agregala a “acciones pendientes” para tenerla siempre a mano.
                    </p>
                    <p className="text-[#383838] font-medium">
                        Una vez que consideres que incorporaste el hábito ¡agregala como logro!
                    </p>
                </BaseModal>
                <section>
                    <div className="px-6 pt-6">
                        <Heading tag="h2" size="h2" color="green" weight="semibold" align="left">
                            <span className="flex gap-2 items-center">
                                Acciones
                                <button
                                    onClick={onOpen}
                                >
                                    <img src={InfoImage} alt="Información de las acciones" className="h-fit" />
                                </button>
                            </span>
                        </Heading>
                        <p>Encontrá acá las acciones disponibles para
                            agregar. Junto con tips que podrian ser útiles.</p>
                    </div>
                    <div className="mt-6 py-4 flex gap-2 overflow-x-auto pl-6">
                        <Pill text="Agua" />
                        <Pill text="Energía" />
                        <Pill text="Transporte" />
                        <Pill text="Alimentación" />
                        <Pill text="Reciclaje" />
                    </div>
                </section>
                <section className="bg-[#005840] text-white p-4 px-6 pb-12 rounded-t-[30px] mt-2 flex-1">
                    <div className="py-6">
                        <Search
                            placeholder="Buscar acciones..."
                            className="w-full mb-4"
                            onSearch={debouncedSearch}
                        />
                        <Select
                            options={[
                                { value: "", label: "Todas" },
                                { value: "Agua", label: "Agua" },
                                { value: "Energía", label: "Energía" },
                                { value: "Transporte", label: "Transporte" },
                                { value: "Alimentación", label: "Alimentación" },
                                { value: "Reciclaje", label: "Reciclaje" },
                            ]}
                            placeholder="Seleccioná una opción"
                            className="w-full"
                            value={category}
                            onChange={handleSelectCategory}
                        />
                    </div>
                    <div
                        className="flex flex-col gap-4 lg:flex-row lg:flex-wrap"
                    >
                        {filteredActions.map((action) => (
                            <ActionCard
                                key={action.id}
                                title={action.title}
                                category={action.category}
                                carbon={action.carbon}
                                description={action.description}
                                imageSrc={action.imageSrc}
                                imageAlt={action.imageAlt}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}