import { useParams } from "react-router-dom";
import { Post } from "../../components/Community/Post";
import { Comment } from "../../components/Community/Comment";
import { Answer } from "../../components/Community/Answer";
import { NavigationLink } from "../../components/Base/NavigationLink";
import { useGetCommentsByPostQuery, useGetPostQuery } from "../../api/postsSlice";
import { usePostComments } from "../../hooks/usePostComments";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

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


    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar el post.</p>;

    return (
        <section className="mx-6 my-6 flex flex-col gap-6">
            <NavigationLink 
                to="/app/community"
                label="Publicación"              
            />
            <div>
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
            <Answer 
                onSubmit={handleComment}
                isLoading={isLoading}
                srcAvatar={user?.avatar}
            />
            <div className="flex flex-col gap-6">
                <Comment 
                likeComment={handleLikeComment}
                answers={comments} />
            </div>
        </section>
    )
}