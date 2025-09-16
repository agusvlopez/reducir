import debounce from "just-debounce-it";
import { useCallback, useState } from "react";
import { Heading } from "../../components/Base/Heading";
import { Pill } from "../../components/Base/Pill";
import { ActionCard } from "../../components/Cards/ActionCard";
import { Search } from "../../components/Inputs/Search";
import ACTIONS from "../../assets/data/actions.json";
import InfoImage from "../../assets/icons/info.png";
import {
    useDisclosure,
} from "@heroui/react";
import { BaseModal } from "../../components/Base/BaseModal.jsx";
import { useGetActionsQuery } from "../../api/actionsSlice.js";

const categories = [
  { value: "", label: "Todas" },
  { value: "Agua", label: "Agua" },
  { value: "Energía", label: "Energía" },
  { value: "Transporte", label: "Transporte" },
  { value: "Alimentación", label: "Alimentación" },
  { value: "Reciclaje", label: "Reciclaje" },
];

export function Actions() {
    const {data: actions, isError, isLoading} = useGetActionsQuery();
    console.log(actions);
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [category, setCategory] = useState("");

    const handlePillClick = (categoryValue) => {
        const value = categoryValue === "Todas" ? "" : categoryValue;
        setCategory(value); 
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
            (!category || action.category.toLowerCase() === category.toLowerCase()) &&
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
                                    className="cursor-pointer hover:opacity-90 transition-all"
                                >
                                    <img src={InfoImage} alt="Información de las acciones" className="h-fit" />
                                </button>
                            </span>
                        </Heading>
                        <p>Encontrá acá las acciones disponibles para
                            agregar. Junto con tips que podrian ser útiles.</p>
                    </div>
                    <div className="mt-6 py-4 flex gap-2 overflow-x-auto pl-6">
                    {categories.map((cat) => (
                        <Pill
                        key={cat.value}
                        text={cat.label}
                        isActive={category === cat.value}
                        onClick={handlePillClick}
                        />
                    ))}
                    </div>
                </section>
                <section className="bg-[#005840] text-white p-4 px-6 pb-12 rounded-t-[30px] mt-2 flex-1">
                    <div className="py-6">
                        <Search
                            placeholder="Buscar acciones..."
                            className="w-full mb-4"
                            onSearch={debouncedSearch}
                        />
                    </div>
                    <div
                        className="flex flex-col gap-4 lg:flex-row lg:flex-wrap"
                    >
                        {isLoading && <p className="text-white">Cargando acciones...</p>}
                        {isError && <p className="text-white">Error al cargar las acciones.</p>}
                        {filteredActions && filteredActions.length === 0 && !isLoading && 
                            <p className="text-white">No se encontraron acciones.</p>}
                        {filteredActions?.map((action) => (
                            <ActionCard
                                key={action._id}
                                id={action._id}
                                title={action.title}
                                category={action.category}
                                carbon={action.carbon}
                                description={action.description}
                                imageSrc={action.image?.url}
                                imageAlt={action.title}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}