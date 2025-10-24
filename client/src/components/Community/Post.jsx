import { Link } from "react-router-dom";
import { PostHeader } from "./PostHeader";
import { PostContent } from "./PostContent";
import { PostFooter } from "./PostFooter";
import { useAuth } from "../../hooks/useAuth";

export function Post({
    className = "",
    id,
    name,
    username,
    profileImage,
    image,
    content,
    category,
    createdAt,
    likesCount,
    commentsCount,
    actionId,
    carbon,
    postUserId
}) {
    const { userId } = useAuth();

    return (
        <section className="flex flex-col gap-4 border-b border-[#6D6D6D] pb-6">
                <PostHeader
                    userId={postUserId}
                    name={name}
                    username={username}
                    profileImage={profileImage}
                />
                <Link to={`/app/${userId}/post/${id}`}
                className={`${className}`}>
                <PostContent
                    image={image} 
                    content={content}
                    category={category}
                    actionId={actionId}
                    carbon={carbon}
                />
            </Link>
            <PostFooter 
                id={id}
                createdAt={createdAt}
                likesCount={likesCount}
                commentsCount={commentsCount}
            />
        </section>
    );
}