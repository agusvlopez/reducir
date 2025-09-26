import { useParams } from "react-router-dom";
import { Avatar } from "../../components/Base/Avatar";
import { PostContent } from "../../components/Community/PostContent";
import { Answer } from "../../components/Community/Answer";
import { NavigationLink } from "../../components/Base/NavigationLink";
import { useGetPostQuery } from "../../api/postsSlice";

export function ComposerPost() {
    const { postId } = useParams();
    const {data: post, isError, isLoading} = useGetPostQuery(postId);
    
    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar el post.</p>;

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
                        <span className="font-semibold">{post?.userInfo?.name}</span>
                        <span className="">@{post?.userInfo?.username}</span>
                    </div>
                    <PostContent 
                        image={post?.image}
                        content={post?.content}
                        category={post?.category}
                    />
                    <p className="mt-6 text-sm">Respondiendo a @{post?.userInfo?.username}</p>
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