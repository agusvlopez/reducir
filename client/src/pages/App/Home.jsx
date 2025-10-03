import { Avatar } from "../../components/Base/Avatar";
import { DonutProgress } from "../../components/DonutProgress";
import TimeIcon from "../../assets/icons/time.png";
import ArrowRightIcon from "../../assets/icons/arrow-next.png";
import { Pill } from "../../components/Base/Pill";
import { CarouselCard } from "../../components/Cards/CarouselCard";
import { useAuth } from "../../hooks/useAuth";
import ACTIONS from "../../assets/data/greenSteps.actions.json";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BaseCarousel } from "../../components/Base/BaseCarousel";
import { useActionsSaved } from "../../hooks/useActionsSaved";

export function Home() {
    const { user } = useAuth();

    // Usamos useGetActionsQuery para obtener todas las acciones
    //TODO: pasar a un hook ? 
    //Esto va una vez que acomode la API de actions
    // const { data: actions, error: isError, isLoading } = useGetActionsQuery();
    // console.log("actions", actions);

    //actionsSaved
    const { actionsSaved } = useActionsSaved();

    const [sectionSelected, setSectionSelected] = useState("actionsSaved");

    const handleSections = (value) => {
        setSectionSelected(value);
    }

    return (
        <>
            <section className="flex flex-col bg-[#005840] text-white p-4 px-6 pb-24 rounded-b-[30px]">
                <div className="flex items-center gap-4">
                    <Avatar src={"https://i.pravatar.cc/300"} alt="User Avatar" className="mb-4" />
                    <div>
                        <p>¡Hola <span className="font-semibold">{user?.name}</span>!</p>
                        <p>Tu huella de carbono este mes:</p>
                        <div>
                            <span></span>
                            <p className="font-semibold"><span className="font-bold">{user?.carbon}</span> kg de CO2</p>
                        </div>

                    </div>
                </div>
            </section>
            <section className="w-[354px] h-[182px] mx-auto mt-[-70px] bg-[#F5F5F5] rounded-[30px] shadow-lg p-4 flex justify-between items-center">
                <div className="text-xs text-[#383838] flex flex-col gap-1">
                    <p>Objetivo</p>
                    <span className="bg-[#ED6C1D] p-1 px-2 rounded-[30px] text-xs text-white">Reducir la huella un 10%</span>

                    <p>Detalles</p>
                    <div className="flex items-center gap-1 text-[#005840] font-semibold">
                        <img src={TimeIcon} alt="Ícono reloj" className="w-3 h-[14px]" />
                        <span>En 1 mes</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#005840] font-semibold">
                        <img src={TimeIcon} alt="Ícono reloj" className="w-3 h-[14px]" />
                        <span>Días restantes: 10</span>
                    </div>

                    <button
                        className="bg-[#005840] text-white py-2 rounded-[30px] flex items-center justify-center mt-2">
                        <span>Continuar progreso</span>
                        <img src={ArrowRightIcon} alt="Ícono flecha derecha" className="inline-block ml-2 w-[15px] h-[15px]" />
                    </button>
                </div>
                <div>
                    {/* PROGRESS DONUT */}
                    <DonutProgress value={72} />
                </div>
            </section>
            <section className="mt-[40px] flex gap-4 overflow-x-auto pl-6 lg:pl-0 pb-2">
                <Pill className="flex-shrink-0" text="Acciones en proceso" onClick={() => handleSections('actionsSaved')} isActive={sectionSelected === 'actionsSaved'} />
                <Pill className="flex-shrink-0" text="Acciones logradas" onClick={() => handleSections('actionsAchieved')} isActive={sectionSelected === 'actionsAchieved'}/>
                <Pill className="flex-shrink-0" text="Mis publicaciones" onClick={() => handleSections('posts')} isActive={sectionSelected === 'posts'}/>
            </section>
            
            {sectionSelected === 'actionsSaved' &&
            <section className="mt-[40px] px-6 flex flex-col gap-4">
                <div>
                    <h2 className="text-[20px] font-semibold">Mis acciones en proceso</h2>
                    <p className="text-xs">Opciones guardadas para hacer cuando te sientas listo/a.</p>
                </div>
                <Link to={"/app/actions"} className="font-semibold text-[#005840]">+ Agregar una acción</Link>

                <BaseCarousel>
                    {/* TODO: USE SWIPER */}
                    {/* {isLoading && <p>Cargando acciones favoritas...</p>} */}
                    {/* {isError && <p>Error al cargar las acciones.</p>} */}
                    {actionsSaved?.map((actionId) => {
                        const savedAction = ACTIONS?.find(a => a._id === actionId);

                        if (!savedAction) return null;

                        return (
                            <CarouselCard
                                key={savedAction._id}
                                actionId={savedAction._id}
                                title={savedAction?.title}
                                imageSrc={savedAction?.image?.url}
                                imageAlt={savedAction?.title}
                                className="mt-4"
                            />
                        );
                    })}
                </BaseCarousel>
            </section>
            }

            {sectionSelected === 'actionsAchieved' &&
            //TODO
            (
                <section>
                    <h2>Acciones logradas</h2>
                </section>
            )
            }

            {sectionSelected === 'posts' &&
            //TODO
            (
                <section>
                    <h2>Mis publicaciones</h2>
                </section>
            )
            }
        </>
    );
}