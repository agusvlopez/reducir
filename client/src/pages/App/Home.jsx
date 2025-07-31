import { Avatar } from "../../components/Base/Avatar";
import { DonutProgress } from "../../components/DonutProgress";
import { AppLayout } from "../../layouts/AppLayout";
import TimeIcon from "../../assets/icons/time.png";
import ArrowRightIcon from "../../assets/icons/arrow-next.png";
import { Pill } from "../../components/Base/Pill";
import { CarouselCard } from "../../components/Cards/CarouselCard";
import { useGetUsersQuery } from "../../api/apiSlice";

export function Home() {

    const { data: users, isError, isLoading, error } = useGetUsersQuery();

    console.log('users', users);
    return (
        <>
            <section className="flex flex-col bg-[#005840] text-white p-4 px-6 pb-24 rounded-b-[30px]">
                <div className="flex items-center gap-4">
                    <Avatar src={"https://i.pravatar.cc/300"} alt="User Avatar" className="mb-4" />
                    <div>
                        <p>¡Hola Nombre de usuario!</p>
                        <p>Tu huella de carbono este mes:</p>
                        <div>
                            <span></span>
                            <p className="text-semibold">72kg de CO2</p>
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
            <section className="mt-[40px] flex gap-2 overflow-x-auto pl-6">
                <Pill text="Acciones en proceso" />
                <Pill text="Acciones en proceso" />
                <Pill text="Acciones en proceso" />
                <Pill text="Acciones en proceso" />
            </section>
            <section className="mt-[40px] px-6 flex flex-col gap-4">
                <div>
                    <h2 className="text-[20px] font-semibold">Mis acciones en proceso</h2>
                    <p className="text-xs">Opciones guardadas para hacer cuando te sientas listo/a.</p>
                </div>
                <button className="font-semibold text-[#005840]">+ Agregar una acción</button>

                <div className="flex gap-4 ">
                    {/* TODO: USE SWIPER */}
                    <CarouselCard
                        title={"Acción 1"}
                        imageSrc={"https://bcdn.products.pcc.eu/wp-content/uploads/2022/08/FOT2-ekologia.jpg"}
                        imageAlt={"Imagen de la acción 1"}
                        className="mt-4"
                    />
                    <CarouselCard
                        title={"Acción 1"}
                        imageSrc={"https://bcdn.products.pcc.eu/wp-content/uploads/2022/08/FOT2-ekologia.jpg"}
                        imageAlt={"Imagen de la acción 1"}
                        className="mt-4"
                    />
                    <CarouselCard
                        title={"Acción 1"}
                        imageSrc={"https://bcdn.products.pcc.eu/wp-content/uploads/2022/08/FOT2-ekologia.jpg"}
                        imageAlt={"Imagen de la acción 1"}
                        className="mt-4"
                    />
                </div>
            </section>
        </>
    );
}