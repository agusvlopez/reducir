import debounce from "just-debounce-it";
import { useCallback, useState, useMemo, useEffect, useRef } from "react";
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

const ITEMS_PER_LOAD = 8;

export function Actions() {
    const {data: actions, isError, isLoading} = useGetActionsQuery();
    console.log(actions);
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [category, setCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleItems, setVisibleItems] = useState(ITEMS_PER_LOAD);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadMoreRef = useRef(null);

    const handlePillClick = (categoryValue) => {
        const value = categoryValue === "Todas" ? "" : categoryValue;
        setCategory(value);
        setVisibleItems(ITEMS_PER_LOAD); // Reset items visibles al cambiar categoría
    };

    const debouncedSearch = useCallback(
        debounce((query) => {
            setSearchQuery(query);
            setVisibleItems(ITEMS_PER_LOAD); // Reset items visibles al buscar
        }, 1000),
        []
    );

    // Filtrar acciones
    const filteredActions = useMemo(() => {
        return ACTIONS?.filter(
            (action) =>
                (!category || action.category.toLowerCase() === category.toLowerCase()) &&
                (!searchQuery || action.title.toLowerCase().includes(searchQuery.toLowerCase()))
        ) || [];
    }, [category, searchQuery]);

    // Datos para mostrar con lazy loading
    const displayedActions = useMemo(() => {
        return filteredActions.slice(0, visibleItems);
    }, [filteredActions, visibleItems]);

    // Cargar más items
    const loadMoreItems = useCallback(() => {
        if (isLoadingMore || visibleItems >= filteredActions.length) return;
        
        setIsLoadingMore(true);
        // Simular delay de carga para mejor UX
        setTimeout(() => {
            setVisibleItems(prev => Math.min(prev + ITEMS_PER_LOAD, filteredActions.length));
            setIsLoadingMore(false);
        }, 300);
    }, [isLoadingMore, visibleItems, filteredActions.length]);

    // Intersection Observer para lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    loadMoreItems();
                }
            },
            { 
                threshold: 0.1,
                rootMargin: '100px' // Empezar a cargar 100px antes de llegar al elemento
            }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [loadMoreItems]);

    // Reset visible items cuando cambian los filtros
    useEffect(() => {
        setVisibleItems(ITEMS_PER_LOAD);
    }, [filteredActions.length]);

    const hasMoreItems = visibleItems < filteredActions.length;
    const showingAllMessage = !hasMoreItems && filteredActions.length > ITEMS_PER_LOAD;

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
                        Agregala a "acciones pendientes" para tenerla siempre a mano.
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
                        
                        {/* Contador de resultados */}
                        {filteredActions.length > 0 && (
                            <div className="mb-4 text-sm opacity-80">
                                <p>
                                    Mostrando {displayedActions.length} de {filteredActions.length} acciones
                                    {hasMoreItems && " • Deslizá para ver más"}
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
                        {isLoading && <p className="text-white">Cargando acciones...</p>}
                        {isError && <p className="text-white">Error al cargar las acciones.</p>}
                        {displayedActions && displayedActions.length === 0 && !isLoading && 
                            <p className="text-white">No se encontraron acciones.</p>}
                        {displayedActions?.map((action, index) => (
                            <ActionCard
                                key={`${action._id}-${index}`} // Mejor key para evitar problemas con lazy loading
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

                    {/* Trigger para lazy loading */}
                    {hasMoreItems && (
                        <div 
                            ref={loadMoreRef} 
                            className="flex justify-center items-center mt-8 py-8 min-h-[80px]"
                        >
                            {isLoadingMore ? (
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    <span className="text-white font-medium">Cargando más acciones...</span>
                                </div>
                            ) : (
                                <div className="text-center opacity-70">
                                    <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-2"></div>
                                    <p className="text-white text-sm">Seguí deslizando para ver más</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mensaje cuando se han cargado todas las acciones */}
                    {showingAllMessage && (
                        <div className="flex justify-center items-center mt-8 py-6">
                            <div className="text-center">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-white/80 text-sm font-medium">
                                    ¡Ya viste todas las acciones disponibles! 🌱
                                </p>
                                <p className="text-white/60 text-xs mt-1">
                                    ¿Ya elegiste cuál vas a empezar?
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}