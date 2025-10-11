import { useParams } from "react-router-dom";
import { Post } from "../../components/Community/Post";
import { Comment } from "../../components/Community/Comment";
import { Answer } from "../../components/Community/Answer";
import { NavigationLink } from "../../components/Base/NavigationLink";
import { useGetCommentsByPostQuery, useGetPostQuery } from "../../api/postsSlice";
import { usePostComments } from "../../hooks/usePostComments";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../../components/Base/Loader";

export function CommunityPost() {
    const { postId } = useParams();
    //TODO: VER SI PUEDO EVITAR ESTA PETICION:
    const { user } = useAuth();
    
    const { createComment } = usePostComments();
    const {data: post, isError, isLoading} = useGetPostQuery(postId);
    
    const {data: comments} = useGetCommentsByPostQuery(postId);

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

    //TODO: AGREGAR LOGICA DE LIKE/DISLIKE(SÍ, ESTA EN BACKEND)


    // Primero, en tu componente donde tienes los comments
    const rootComments = comments?.filter(c => !c.isReply);

    // Función helper para obtener las respuestas de un comentario
    const getRepliesForComment = (commentId) => {
    return comments?.filter(c => c.isReply && c.parentCommentId === commentId);
    };

    if (isLoading) return <Loader size="lg" color="green" />;
    if (isError) return <p>Error al cargar el post.</p>;
console.log("post", post);

    return (
        <section className="mx-6 my-6 flex flex-col gap-6">
            <NavigationLink 
                to="/app/community"
                label="Publicación"              
            />
            <div>
                {/* POST */}
                <Post 
                    id={post?._id}
                    name={post?.userInfo?.name}
                    username={post?.userInfo?.username}
                    profileImage={post?.userInfo?.profileImage}
                    image={post?.image}
                    content={post?.content}
                    category={post?.category}
                    createdAt={post?.createdAt}
                    likesCount={post?.likesCount}
                    commentsCount={post?.commentsCount}
                    />
            </div>
            {/* FORMULARIO DE RESPUESTA AL POST */}
            <div className="border-b border-[#6D6D6D]">
                <Answer 
                    onSubmit={handleComment}
                    isLoading={isLoading}
                    srcAvatar={user?.image}
                />
            </div>
            <div className="flex flex-col gap-6">
                {/* COMENTARIOS RAÍZ con sus respuestas */}
                {rootComments?.map(comment => (
                    <div key={comment._id}>
                    {/* Comentario principal */}
                    <Comment
                        comment={comment}
                    />
                    
                    {/* Respuestas a este comentario */}
                    {getRepliesForComment(comment._id).length > 0 && (
                        <div className="ml-6 lg:ml-12 mt-4 flex flex-col gap-4 border-l-2 border-gray-200 pl-4">
                        {getRepliesForComment(comment._id)?.map(reply => (
                            <Comment
                                key={reply._id}
                                comment={reply}
                                isReply={true}
                                allComments={comments}
                            />
                        ))}
                        </div>
                    )}
                    </div>
                ))}
                </div>
        </section>
    )
}