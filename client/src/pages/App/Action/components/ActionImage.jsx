import { ImagePill } from "../../../../components/Base/ImagePill";

export default function ActionImage({ action }) {
    return (
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[356px] lg:mt-[-70px]">
                <div className="bg-white rounded-[30px] shadow-xl overflow-hidden aspect-square">
                    <ImagePill
                        category={action.category}
                        imageSrc={action.image?.url}
                        imageAlt={action.title}
                    />
                </div>
            </div>
        </div>
    );
}