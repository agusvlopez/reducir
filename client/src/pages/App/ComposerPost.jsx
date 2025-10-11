// TODO: VER SI LO USO, POR AHORA LO VOY A DEJAR EN DESUSO

import { useParams } from "react-router-dom";
import { Avatar } from "../../components/Base/Avatar";
import { PostContent } from "../../components/Community/PostContent";
import { Answer } from "../../components/Community/Answer";
import { NavigationLink } from "../../components/Base/NavigationLink";
import { useGetPostQuery } from "../../api/postsSlice";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { usePostComments } from "../../hooks/usePostComments";
import { Loader } from "../../components/Base/Loader";

export function ComposerPost() {
    const { postId } = useParams();
    //TODO: VER SI PUEDO EVITAR ESTA PETICION:
    const { user } = useAuth();
    const { createComment } = usePostComments();
    const {data: post, isError, isLoading} = useGetPostQuery(postId);


    if (isLoading) return <Loader size="md" color="green" />;
    if (isError) return <p>Error al cargar el post.</p>;

    const handleComment = async (content, form) => {
        try {
            await createComment({ 
                postId: postId, 
                content 
            });
            
            form.reset();
            toast.success("Comentario publicado");
        } catch (error) {
            console.error(error);
            toast.error("Error al comentar");
        }
    }

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
                onSubmit={handleComment}
                isLoading={isLoading}
                srcAvatar={user?.image}
            />
        </section>
    )
}