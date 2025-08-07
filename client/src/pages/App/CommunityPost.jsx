import { Link } from "react-router-dom";
import { Post } from "../../components/Community/Post";
import { Avatar } from "../../components/Base/Avatar";
import { Comment } from "../../components/Community/Comment";
import { BaseTextarea } from "../../components/Inputs/BaseTextarea";
import { Answer } from "../../components/Community/Answer";
import { NavigationLink } from "../../components/Base/NavigationLink";

const answers = [{
    username: "@username",
    name: "usuario",
    comment: "comentario"
}]

export function CommunityPost() {
    // const { postId } = useParams();

    return (
        <section className="mx-6 my-6 flex flex-col gap-6">
            <NavigationLink 
                to="/app/community"
                label="Publicación"              
            />
            <div>
                <Post />
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