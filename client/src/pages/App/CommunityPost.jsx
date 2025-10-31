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
        <div className="min-h-screen bg-[#F5F5F5]">
            {/* Container principal con max-width para desktop */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* Navegación */}
                <div className="mb-6">
                    <NavigationLink 
                        to="/app/community"
                        label="Publicación"              
                    />
                </div>

                {/* Layout de 2 columnas en desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Columna principal - Post y comentarios */}
                    <main className="lg:col-span-8">
                        {/* POST en card */}
                        <div className="bg-white rounded-[30px] shadow-sm mb-6 p-6">
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

                        {/* FORMULARIO DE RESPUESTA */}
                        <div className="bg-white rounded-[30px] shadow-sm p-6 mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                Agregar un comentario
                            </h3>
                            <Answer 
                                onSubmit={handleAnswer}
                                isLoading={createAnswerLoading}
                                srcAvatar={user?.image}
                            />
                        </div>

                        {/* SECCIÓN DE COMENTARIOS */}
                        <div className="bg-white rounded-[30px] shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                Comentarios ({rootComments?.length || 0})
                            </h3>
                            
                            <div className="flex flex-col gap-6">
                                {isCommentsLoading && (
                                    <div className="text-center py-8">
                                        <Loader />
                                        <p className="text-gray-500 mt-2">Cargando comentarios...</p>
                                    </div>
                                )}
                                
                                {isCommentsError && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                                        Error al cargar los comentarios.
                                    </div>
                                )}

                                {!isCommentsLoading && !isCommentsError && rootComments?.length === 0 && (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>
                                        <p className="text-gray-600 font-medium">
                                            Aún no hay comentarios
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Sé el primero en comentar
                                        </p>
                                    </div>
                                )}

                                {rootComments?.map(comment => (
                                    <div key={comment._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        {/* Comentario principal */}
                                        <Comment
                                            comment={comment}
                                        />
                                        
                                        {/* Respuestas a este comentario */}
                                        {getRepliesForComment(comment._id).length > 0 && (
                                            <div className="mt-4 flex flex-col gap-4 border-l-2 border-[#005840]/20 pl-4 ml-8 lg:ml-12">
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
                        </div>
                    </main>

                    {/* Columna lateral - Info adicional (sticky) */}
                    <aside className="lg:col-span-4">
                        <div className="lg:sticky lg:top-6 space-y-4">
                            {/* Card de estadísticas del post */}
                            <div className="bg-white rounded-[30px] shadow-sm p-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                    Estadísticas
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                            </svg>
                                            Me gusta
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {post?.likesCount || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                            Comentarios
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {post?.commentsCount || 0}
                                        </span>
                                    </div>
                                    {post?.carbon_reduced && (
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-600">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                                </svg>
                                                CO₂ reducido
                                            </span>
                                            <span className="text-sm font-semibold text-green-600">
                                                {post?.carbon_reduced}kg
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card de categoría */}
                            {post?.category && (
                                <div className="bg-[#005840] rounded-[30px] shadow-sm p-6">
                                    <h3 className="text-sm font-semibold text-white mb-2">
                                        Categoría
                                    </h3>
                                    <span className="inline-block bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                                        {post?.category}
                                    </span>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}