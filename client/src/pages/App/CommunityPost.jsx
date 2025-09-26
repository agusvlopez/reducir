import { Link, useParams } from "react-router-dom";
import { Post } from "../../components/Community/Post";
import { Avatar } from "../../components/Base/Avatar";
import { Comment } from "../../components/Community/Comment";
import { Answer } from "../../components/Community/Answer";
import { NavigationLink } from "../../components/Base/NavigationLink";
import { useGetPostQuery } from "../../api/postsSlice";

const answers = [{
    username: "@username",
    name: "usuario",
    comment: "comentario"
}]

export function CommunityPost() {
    const { postId } = useParams();

    const {data: post, isError, isLoading} = useGetPostQuery(postId);
    //TODO: AGREGAR COMMENTS (FALTA EN BACKEND)

    //TODO: AGREGAR LOGICA DE LIKE/DISLIKE(SI ESTA EN BACKEND)

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
                labelButton="Publicar"
                placeholder="Comentá tu respuesta"
                name="comment"
                srcAvatar="https://i.pravatar.cc/300"
            />
            <div className="flex flex-col gap-6">
                <Comment answers={answers} />
                <Comment />
            </div>
        </section>
    )
}