import { Link } from "react-router-dom";
import { Avatar } from "../../components/Base/Avatar";
import { PostHeader } from "../../components/Community/PostHeader";
import { PostContent } from "../../components/Community/PostContent";
import { PostFooter } from "../../components/Community/PostFooter";
import { BaseTextarea } from "../../components/Inputs/BaseTextarea";
import { Answer } from "../../components/Community/Answer";
import { NavigationLink } from "../../components/Base/NavigationLink";

export function ComposerPost() {
    return (
        <section className="mx-6 my-6 flex flex-col gap-6">
            <NavigationLink
                to="/app/community"
                label="Publicación"              
            />

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

            <Answer 
                labelButton="Responder"
                placeholder="Comentá tu respuesta"
                name="comment"
                srcAvatar="https://i.pravatar.cc/300"
            />
        </section>
    )
}