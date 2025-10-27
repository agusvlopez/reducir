import { toast } from "sonner";
import { useGetCommentLikeStatusQuery, useToggleCommentLikeMutation } from "../../api/postsSlice.js";
import { usePostComments } from "../../hooks/usePostComments.js";
import { Avatar } from "../Base/Avatar";
import { HeartIcon } from "../Icons/Heart";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { PostModal } from "./PostModal.jsx";
import { useParams } from "react-router-dom";
import { formatDate } from "../../helpers/formatDate.js";


export function Comment({ comment, allComments, level = 0 }) {
  const replies = allComments?.filter(c => c.parentCommentId === comment._id);
  
  // Máximo 2 niveles de indentación visual
  const maxIndentLevel = 1;
  const shouldIndent = level < maxIndentLevel;
  
  return (
    <div className={`${level === 0 ? 'border-b border-gray-soft pb-6' : ''}`}>
      <CommentItem 
        answer={comment}
      />
      
      {replies?.length > 0 && (
        <div className={`mt-4 flex flex-col gap-4 ${shouldIndent ? 'ml-6 lg:ml-12 border-l border-gray-200 pl-4' : ''}`}>
          {replies?.map(reply => (
            <Comment
              key={reply._id}
              comment={reply}
              allComments={allComments}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente separado para cada comentario individual
function CommentItem({ answer }) {     
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateCommentLoading, setIsCreateCommentLoading] = useState(false);

  const { user } = useAuth();
  
  const handleAddComment = async () => {
    setIsModalOpen(true);
  }
  
  const { data: likeStatus, isLoading: isLikeStatusLoading } = useGetCommentLikeStatusQuery({ commentId: answer._id, userId: answer.userId?._id });
  
  const [toggleLike] = useToggleCommentLikeMutation({ commentId: answer._id, userId: answer.userId?._id });

  const handleLike = async () => {
    await toggleLike({ commentId: answer._id, userId: answer.userId?._id });
  };

  const { postId } = useParams();
  const { createComment } = usePostComments();
  
  //todo: pasar la logica de comentar a un custom hook, tambien usado en postFooter.jsx
  const handleComment = async (content, form) => {
    setIsCreateCommentLoading(true);
    try {
        await createComment({ 
            postId: postId, 
            content,
            parentCommentId: answer._id
        });
        setIsCreateCommentLoading(false);
        form.reset();
        toast.success("Comentario publicado");
        setIsModalOpen(false);
    } catch (error) {
        console.error(error);
        setIsCreateCommentLoading(false);
        toast.error("Error al comentar");
    }
  }  
  
  return (
    <>
    {isModalOpen && (
      <PostModal 
        handleComment={handleComment}
        isOpen={isModalOpen} 
        srcAvatar={user?.image}
        onClose={() => setIsModalOpen(false)}
        isPostLoading={isCreateCommentLoading}
      />
    )}
    <div className="flex justify-between gap-4">
      <Avatar src={answer?.userId?.image} />
      <div className="flex-1 flex flex-col gap-2">
        <div>
          <div className="flex items-center gap-1">
            <span>{answer?.userInfo?.name}</span>
            <span>@{answer?.userInfo?.username}</span>
          </div>
          <p>{answer?.content}</p>
        </div>
        <div className="flex items-center gap-4 justify-between text-[#6D6D6D] mt-2">
          {/* Fecha del comentario */}
          <div>
            <p className="text-[#6D6D6D] text-sm">{formatDate(answer?.createdAt)}</p>
          </div>  
          {/* Botones de interacción */}
          <div className="flex items-start gap-4 justify-end text-[#6D6D6D]">        
            <button 
              className="flex items-center gap-1 text-sm hover:text-dark-green transition-colors cursor-pointer"
              onClick={handleAddComment}
            >
              {/* Icono de comentario */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
              </svg>
              <span>{answer?.repliesCount}</span>
            </button>
            <button
              className="flex items-center gap-1 text-sm"
              onClick={handleLike}
            >
              <HeartIcon 
                isFilled={likeStatus?.hasLiked} 
              />
              <span>{isLikeStatusLoading ? '...' : (likeStatus?.likesCount || 0)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}