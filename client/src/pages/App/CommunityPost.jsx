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
import { useState } from "react";

export function CommunityPost() {
    const { postId } = useParams();
    //TODO: VER SI PUEDO EVITAR ESTA PETICION:
    const { user } = useAuth();
    
    const { createComment } = usePostComments();
    const { data: post, isLoading: isPostLoading, isError: isPostError } = useGetPostQuery(postId);
    const { data: comments, isLoading: isCommentsLoading, isError: isCommentsError } = useGetCommentsByPostQuery(postId);

    const [createAnswerLoading, setCreateAnswerLoading] = useState(false);

    const handleAnswer = async (content, form) => {
        setCreateAnswerLoading(true);
        try {
            await createComment({ 
                postId: postId, 
                content 
            });
            setCreateAnswerLoading(false);
            form.reset();
            toast.success("Comentario publicado");
        } catch (error) {
            console.error(error);
            toast.error("Error al comentar");
            setCreateAnswerLoading(false);
        }
    }

    const rootComments = comments?.filter(c => !c.isReply);

    //TODO: Función helper para obtener las respuestas de un comentario
    const getRepliesForComment = (commentId) => {
        return comments?.filter(c => c.isReply && c.parentCommentId === commentId);
    };

    if (isPostLoading) return <Loader size="lg" color="green" />;
    if (isPostError) return <p>Error al cargar el post.</p>;


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
                    name={post?.userId?.name}
                    username={post?.userId?.username}
                    profileImage={post?.userId?.image}
                    image={post?.image}
                    content={post?.content}
                    category={post?.category}
                    createdAt={post?.createdAt}
                    likesCount={post?.likesCount}
                    commentsCount={post?.commentsCount}
                    actionId={post?.actionId}
                    carbon={post?.carbon_reduced}
                />
            </div>
            {/* FORMULARIO DE RESPUESTA AL POST */}
            <div className="border-b border-[#6D6D6D]">
                <Answer 
                    onSubmit={handleAnswer}
                    isLoading={createAnswerLoading}
                    srcAvatar={user?.image}
                />
            </div>
            <div className="flex flex-col gap-6">
                {/* COMENTARIOS RAÍZ con sus respuestas */}
                {isCommentsLoading && <Loader />}
                {isCommentsError && <p>Error al cargar los comentarios.</p>}

                {rootComments?.map(comment => (
                    <div key={comment._id}>
                    {/* Comentario principal */}
                    <Comment
                        comment={comment}
                    />
                    
                    {/* Respuestas a este comentario */}
                    {getRepliesForComment(comment._id).length > 0 && (
                        <div className="mt-4 flex flex-col gap-4 border-l border-gray-200 pl-4 ml-6 lg:ml-12">
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