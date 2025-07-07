import { Link } from "react-router";
import { BaseButton } from "../../components/Base/BaseButton";
import { Avatar } from "../../components/Base/Avatar";
import { PostHeader } from "../../components/Community/PostHeader";
import { PostContent } from "../../components/Community/PostContent";
import { PostFooter } from "../../components/Community/PostFooter";

export function ComposerPost() {
    return (
        <section className="mx-6 my-6 flex flex-col gap-6">
            <Link
                to={`/community`}
                className="text-[#005840] flex items-center justify-between gap-8 text-lg font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </Link>

            <div className="flex gap-4">
                <div className="flex flex-col">
                    <Avatar src="https://i.pravatar.cc/300" />
                    {/* line */}
                    <span className="h-full w-[2px] block mx-auto bg-[#6D6D6D] mt-2"></span>
                </div>
                <div className="flex-1">
                    <div className={`flex flex-col gap-1 mb-2 text-sm`}>
                        <span className="font-semibold">Nombre usuario</span>
                        <span className="">@nombredeusuario</span>
                    </div>
                    <PostContent />
                    <p className="mt-6 text-sm">Respondiendo a @nombredeusuario </p>
                </div>
            </div>
            {/* hacer comentario */}
            <div className="flex items-center gap-4">
                <Avatar src="https://i.pravatar.cc/300" />
                <form className="flex-1 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Comentá tu respuesta"
                    />
                    <BaseButton buttonType="submit">
                        Responder
                    </BaseButton>
                </form>
            </div>
        </section>
    )
}