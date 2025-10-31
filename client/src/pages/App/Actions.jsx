import debounce from "just-debounce-it";
import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import { Heading } from "../../components/Base/Heading";
import { Pill } from "../../components/Base/Pill";
import { ActionCard } from "../../components/Cards/ActionCard";
import { Search } from "../../components/Inputs/Search";
import ACTIONS from "../../assets/data/greenSteps.actions.json";
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
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const [category, setCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleItems, setVisibleItems] = useState(ITEMS_PER_LOAD);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMoreRef = useRef(null);

    const handlePillClick = (categoryValue) => {
        const value = categoryValue === "Todas" ? "" : categoryValue;
        setCategory(value);
        setVisibleItems(ITEMS_PER_LOAD); 
    };

    const debouncedSearch = useCallback(
        debounce((query) => {
            setSearchQuery(query);
            setVisibleItems(ITEMS_PER_LOAD);
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
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
        <BaseModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="¿Qué son las acciones?"
        >
            <p className="text-[#383838] font-medium mb-3">
                ¡Observá todos los tips y empezá a hacer la acción que quieras!
            </p>
            <p className="text-[#383838] font-medium mb-3">
                Agregala a "acciones pendientes" para tenerla siempre a mano.
            </p>
            <p className="text-[#383838] font-medium">
                Una vez que consideres que incorporaste el hábito ¡agregala como logro!
            </p>
        </BaseModal>
        
        {/* Header Section */}
        <section>
            <div className="max-w-7xl mx-auto py-6 lg:py-8">
                <div className="px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
                    {/* Título y descripción */}
                    <div className="flex-1">
                        <Heading 
                            tag="h2" 
                            weight="semibold" 
                            align="left" 
                            variant="headline"
                            className="mb-3"
                        >
                            <span className="flex gap-2 items-center">
                                Acciones
                                <button
                                    onClick={onOpen}
                                    className="cursor-pointer hover:opacity-90 transition-all"
                                    aria-label="Información sobre acciones"
                                >
                                    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="15" r="12" fill="#ED6C1D"/>
                                        <path d="M13.272 22.536C13.272 22.952 13.136 23.304 12.864 23.592C12.592 23.864 12.248 24 11.832 24C11.416 24 11.072 23.864 10.8 23.592C10.528 23.304 10.392 22.952 10.392 22.536V12.624C10.392 12.208 10.528 11.864 10.8 11.592C11.072 11.304 11.416 11.16 11.832 11.16C12.248 11.16 12.592 11.304 12.864 11.592C13.136 11.864 13.272 12.208 13.272 12.624V22.536ZM11.808 9.6C11.264 9.6 10.88 9.512 10.656 9.336C10.432 9.16 10.32 8.848 10.32 8.4V7.944C10.32 7.48 10.44 7.168 10.68 7.008C10.936 6.832 11.32 6.744 11.832 6.744C12.392 6.744 12.784 6.832 13.008 7.008C13.232 7.184 13.344 7.496 13.344 7.944V8.4C13.344 8.864 13.224 9.184 12.984 9.36C12.744 9.52 12.352 9.6 11.808 9.6Z" fill="white"/>
                                    </svg>
                                </button>
                            </span>
                        </Heading>
                        <p className="text-gray-600 text-sm lg:text-base max-w-2xl">
                            Encontrá acá las acciones disponibles para agregar.
                        </p>
                    </div>

                    {/* Búsqueda en desktop */}
                    <div className="lg:w-96">
                        <Search
                            placeholder="Buscar acciones..."
                            className="w-full"
                            onSearch={debouncedSearch}
                        />
                    </div>
                </div>

                <div className="relative mt-6">
                    <div className="overflow-x-auto pb-4">
                        <div className="flex gap-3 min-w-max lg:justify-center">
                            {categories.map((cat) => (
                                <Pill
                                    key={cat.value}
                                    text={cat.label}
                                    isActive={category === cat.value}
                                    onClick={handlePillClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Contenido principal */}
        <section className="bg-[#005840] flex-1 rounded-t-[30px] lg:rounded-t-[40px] -mt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                
                {/* Contador de resultados */}
                {filteredActions.length > 0 && (
                    <div className="mb-6 text-white text-sm opacity-90">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">
                                Mostrando {displayedActions.length} de {filteredActions.length} acciones
                            </span>
                            {hasMoreItems && (
                                <span className="hidden lg:inline text-white/70">
                                    • Seguí deslizando para ver más
                                </span>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Grid de acciones - responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {isLoading && (
                        <div className="col-span-full flex justify-center py-12">
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                <p className="text-white font-medium">Cargando acciones...</p>
                            </div>
                        </div>
                    )}
                    
                    {isError && (
                        <div className="col-span-full bg-red-500/20 backdrop-blur-sm text-white p-6 rounded-xl text-center">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-medium">Error al cargar las acciones.</p>
                        </div>
                    )}
                    
                    {displayedActions && displayedActions.length === 0 && !isLoading && (
                        <div className="col-span-full bg-white/10 backdrop-blur-sm text-white p-12 rounded-xl text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-lg font-medium mb-2">No se encontraron acciones</p>
                            <p className="text-white/70 text-sm">Intentá con otros términos de búsqueda o categorías</p>
                        </div>
                    )}
                    
                    {displayedActions?.map((action) => (
                        <ActionCard
                            key={action._id}
                            id={action?._id}
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
                        className="flex justify-center items-center mt-8 lg:mt-12 py-8 min-h-[80px]"
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
                    <div className="flex justify-center items-center mt-8 lg:mt-12 py-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-8 py-6 text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-white text-base lg:text-lg font-medium mb-2">
                                ¡Ya viste todas las acciones disponibles! 🌱
                            </p>
                            <p className="text-white/70 text-sm">
                                ¿Ya elegiste cuál vas a empezar?
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* Estilos adicionales para ocultar scrollbar */}
        <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
    </div>
)
}