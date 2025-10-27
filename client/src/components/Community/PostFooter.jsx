import { HeartIcon } from "../Icons/Heart";
import { formatDate } from "../../helpers/formatDate";
import { useFavoritePosts, useFavoritePostStatus } from "../../hooks/useFavoritePosts";
import { useState } from "react";
import { toast } from "sonner";
import { usePostComments } from "../../hooks/usePostComments";
import { PostModal } from "./PostModal";
import { useAuth } from "../../hooks/useAuth";

export function PostFooter({
    id,
    createdAt,
    likesCount,
    commentsCount
}) {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateCommentLoading, setIsCreateCommentLoading] = useState(false);

    const { handleToggleFavoritePost } = useFavoritePosts();
    const { isLiked, isLoading } = useFavoritePostStatus(id);

    const handleToggle = async () => {
        await handleToggleFavoritePost(id);
    }
    
    const handleOpenCommentModal = () => {
        setIsModalOpen(true);
    }
    const { createComment } = usePostComments();

    // Modal para agregar comentario
    const handleComment = async (content, form) => {
        setIsCreateCommentLoading(true);
        try {
            await createComment({ 
                postId: id, 
                content,
            });
            setIsCreateCommentLoading(false);
            form.reset();
            toast.success("Comentario publicado");
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Error al comentar");
            setIsCreateCommentLoading(false);
        }
    }    
    return (
        <>
        {/* Modal para agregar comentario */}
        {isModalOpen && (
            <PostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                handleComment={handleComment}
                srcAvatar={user?.image}
                isPostLoading={isCreateCommentLoading}
            />
        )}
        <div className="text-[#383838] flex items-center gap-4 justify-between">
            <div>
                <p className="text-[#6D6D6D] text-sm">{formatDate(createdAt)}</p>
            </div>
            <div className="flex items-center gap-4">
                {/* <Link 
                    className="flex items-center gap-1 text-[#6D6D6D] text-sm font-semibold" 
                    to={`/app/${userId}/post/${id}`}
                > */}
                <button
                    className="flex items-center gap-1 text-[#6D6D6D] text-sm hover:text-dark-green transition-colors cursor-pointer"
                    onClick={handleOpenCommentModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>
                    <span>{commentsCount}</span>
                </button>
                {/* </Link> */}
                <button className="flex items-center gap-1 text-[#6D6D6D] text-sm font-semibold">
                    <HeartIcon isFilled={isLiked} handleClick={handleToggle} isLoading={isLoading} />
                    <span>{likesCount}</span>
                </button>
            </div>
        </div>
        </>
    )
}