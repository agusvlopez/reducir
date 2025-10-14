import { Avatar } from "../../components/Base/Avatar";
import { DonutProgress } from "../../components/DonutProgress";
import { Pill } from "../../components/Base/Pill";
import { CarouselCard } from "../../components/Cards/CarouselCard";
import { useAuth } from "../../hooks/useAuth";
import ACTIONS from "../../assets/data/greenSteps.actions.json";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BaseCarousel } from "../../components/Base/BaseCarousel";
import { useActionsSaved } from "../../hooks/useActionsSaved";
import { useGetUserQuery } from "../../api/apiSlice";

export function Home() {
    const { userId } = useAuth();
    
    const { data: userData, isLoading: isUserLoading } = useGetUserQuery(userId, { skip: !userId });

    const actionsAchieved = useMemo(() => userData?.actions_achieved || [], [userData]);
    
    // Usamos useGetActionsQuery para obtener todas las acciones
    //TODO: pasar a un hook ? 
    //Esto va una vez que acomode la API de actions
    // const { data: actions, error: isError, isLoading } = useGetActionsQuery();
    // console.log("actions", actions);

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
                        <p>¡Hola <span className="font-semibold">{isUserLoading ? '...' : userData?.name}</span>!</p>
                        <p>Tu huella de carbono este mes:</p>
                        <div>
                            <span></span>
                            <p className="font-semibold"><span className="font-bold">{isUserLoading ? '-' : userData?.carbon}</span> kg de CO2</p>
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
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="6" cy="6" r="6" fill="#005840"/>
                        <path d="M6 4V6.5L7.5 8.5" stroke="#D9D9D9" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                        <span>En 1 mes</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#005840] font-semibold">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="6" cy="6" r="6" fill="#005840"/>
                        <path d="M6 4V6.5L7.5 8.5" stroke="#D9D9D9" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Días restantes: 10</span>
                    </div>

                    <button
                        className="bg-[#005840] text-white py-2 rounded-[30px] flex items-center justify-center mt-2">
                        <span>Continuar progreso</span>
                        <svg className="inline-block ml-2 w-[15px] h-[15px]" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2878_85)">
                        <circle cx="7.5" cy="7.5" r="7.5" fill="#F1EDEC"/>
                        <path d="M6 5L9 7.5L6 10" stroke="#005840" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_2878_85">
                        <rect width="15" height="15" rx="7.5" fill="white"/>
                        </clipPath>
                        </defs>
                        </svg>
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
                    <p className="text-sm">Opciones guardadas para hacer cuando te sientas listo/a.</p>
                </div>
                <Link to={"/app/actions"} className="font-semibold text-[#005840] flex items-center gap-2 hover:underline w-max">
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7.5" cy="7.5" r="7.5" fill="#005840"/>
                <path d="M7.5 4.875V10.125M4.875 7.5H10.125" stroke="#F1EDEC" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Agregar una acción
                </Link>

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
            <section className="mt-[40px] px-6 flex flex-col gap-4">
                <div>
                    <h2 className="text-[20px] font-semibold">Acciones logradas</h2>
                    <p className="text-sm">Estas son las acciones que lograste hasta el momento. ¿Querés compartilo con tu comunidad?</p>
                </div>
                    <BaseCarousel>
                        {actionsAchieved?.map((actionId) => {
                            const achievedAction = ACTIONS?.find(a => a._id === actionId);                        
                            
                            if (!achievedAction) return null;

                            return (
                                <CarouselCard
                                    key={achievedAction._id}
                                    actionId={achievedAction._id}
                                    title={achievedAction?.title}
                                    imageSrc={achievedAction?.image?.url}
                                    imageAlt={achievedAction?.title}
                                    className="mt-4"
                                />
                            );
                        })}
                    </BaseCarousel>
                </section>
            )
            }

            {sectionSelected === 'posts' &&
            //TODO
            (
            <section className="mt-[40px] px-6 flex flex-col gap-4">
                <div>
                    <h2 className="text-[20px] font-semibold">Mis publicaciones</h2>
                    <p className="text-sm mb-2">Todas tus publicaciones se muestran acá.</p>
                    <Link to={"/app/posts"} className="text-dark-green font-semibold">Ir a comunidad</Link>
                </div>
                </section>
            )
            }
        </>
    );
}