import { useParams } from "react-router";
import { Heading } from "../../components/Base/Heading";
import ACTIONS from "../../assets/data/actions.json";
import BaseButton from "../../components/Base/BaseButton";
import { HeartIcon } from "../../components/Icons/Heart";
import { PlusIcon } from "../../components/Icons/Plus";
import { CarbonIcon } from "../../components/Icons/Carbon";
import { ImagePill } from "../../components/Base/ImagePill";

export function Action() {
    const { id } = useParams();

    //buscar la acción por id en el archivo json
    const action = ACTIONS.find(action => action.id === id);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col justify-center h-full bg-[#005840] text-white p-6 pb-24 rounded-b-[30px]">
                <Heading tag="h2" size="h2" weight="semibold" align="left">{action.title}</Heading>
                <p className="mt-4">{action.description}</p>
            </div>
            <section className="w-5/6 max-w-[356px] mx-auto flex flex-col items-center justify-center gap-4 pt-0">
                {/* imagen  */}
                <div className="h-[356px] mx-auto mt-[-70px] bg-[#F5F5F5] rounded-[30px] shadow-lg overflow-hidden p-0">
                    <ImagePill
                        category={action.category}
                        imageSrc={action.imageSrc}
                        imageAlt={action.imageAlt}
                    />
                </div>

                <div className="w-full flex items-center justify-end gap-2 text-[#005840] font-semibold">
                    <CarbonIcon className="inline-block" />
                    <span>
                        Reducirás -{action.carbon} kg
                    </span>

                </div>

                <div className="flex flex-col items-center gap-6 text-center mt-2">
                    <BaseButton className="w-full max-w-[300px]">
                        <HeartIcon className="inline-block mr-2" />
                        Agregar a mis objetivos
                    </BaseButton>
                    <BaseButton variant="outline" className="w-full max-w-[300px]">
                        <PlusIcon className="inline-block mr-2" />
                        Marcar como completado
                    </BaseButton>
                </div>
            </section>
        </div>
    )
}