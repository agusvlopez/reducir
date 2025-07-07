import { Link } from "react-router";
import { Post } from "../../components/Community/Post";
import { Avatar } from "../../components/Base/Avatar";
import { BaseButton } from "../../components/Base/BaseButton";
import { Comment } from "../../components/Community/Comment";

const answers = [{
    username: "@username",
    name: "usuario",
    comment: "comentario"
}]

export function CommunityPost() {
    // const { postId } = useParams();

    return (
        <section className="mx-6 my-6 flex flex-col gap-6">

            {/* TODO: MAKE A COMPONENT */}
            <Link
                to={`/community`}
                className="text-[#005840] flex items-center gap-8 text-lg font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Publicación
            </Link>

            <div>
                <Post />
            </div>
            {/* POST A COMMENT (FORM) */}
            <div className="flex items-center justify-between gap-4 border-b border-[#6D6D6D] pb-6">
                <Avatar
                    src="https://i.pravatar.cc/300"
                />
                <form className="flex-1 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Comentá tu respuesta"
                    />
                    <BaseButton buttonType="submit">
                        Publicar
                    </BaseButton>
                </form>
            </div>

            <div className="flex flex-col gap-6">
                <Comment answers={answers} />
                <Comment />
            </div>
        </section>
    )
}