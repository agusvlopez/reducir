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
    commentsCount
}) {
    const { userId } = useAuth();

    return (
        <section className="flex flex-col gap-4 border-b border-[#6D6D6D] pb-6">
            <Link to={`/app/${userId}/post/${id}`}
                className={`${className}`}>
                <PostHeader
                    name={name}
                    username={username}
                    profileImage={profileImage}
                />
                <PostContent
                    image={image} 
                    content={content}
                    category={category}
                />
            </Link>
            <PostFooter 
                id={id}
                createdAt={createdAt}
                likesCount={likesCount}
                commentsCount={commentsCount}
                userId={userId}
            />
        </section>
    );
}