import { Link, useParams } from "react-router-dom";
import { Avatar } from "../Base/Avatar";
import { PostHeader } from "./PostHeader";
import { PostContent } from "./PostContent";
import { PostFooter } from "./PostFooter";

export function Post() {
    // const { userId, postId } = useParams();
    // console.log(userId, postId);

    return (
        <section className="flex flex-col gap-4 border-b border-[#6D6D6D] pb-6">
            <Link to="/app/1/post/1"
                className={``}>
                <PostHeader />
                <PostContent />
            </Link>

            <PostFooter />
        </section>
    );
}