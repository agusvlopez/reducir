import { useGetCommentLikeStatusQuery, useToggleCommentLikeMutation } from "../../api/postsSlice.js";
import { Avatar } from "../Base/Avatar";
import { HeartIcon } from "../Icons/Heart";

export function Comment({ answers }) {
  const handleAddComment = () => {
    console.log("answer comment");
  }

  return (
    <div className="flex flex-col gap-4 border-b border-[#6D6D6D] pb-6">
      {answers?.map(answer => (
        <CommentItem 
          key={answer._id} 
          answer={answer} 
          handleAddComment={handleAddComment}
        />
      ))}
    </div>
  )
}

// Componente separado para cada comentario individual
function CommentItem({ answer, handleAddComment }) {    
    console.log("answer", answer);
    
  const { data: likeStatus, isLoading: isLikeStatusLoading } = useGetCommentLikeStatusQuery({ commentId: answer._id, userId: answer.userId });
  console.log("likeStatus", likeStatus);
  
  const [toggleLike, { isLoading }] = useToggleCommentLikeMutation({ commentId: answer._id, userId: answer.userId });

  const handleLike = () => {
    toggleLike({ commentId: answer._id, userId: answer.userId });
  };

  return (
    <div className="flex justify-between gap-4">
      <Avatar src={answer?.userInfo?.profileImage} />
      <div className="flex-1 flex flex-col gap-2">
        <div>
          <div className="flex items-center gap-1">
            <span>{answer?.userInfo?.name}</span>
            <span>@{answer?.userInfo?.username}</span>
          </div>
          <p>{answer?.content}</p>
        </div>
        <div className="flex items-center gap-4 justify-end text-[#6D6D6D]">
          <button 
            className="cursor-pointer"
            onClick={handleAddComment}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
          </button>
          <button onClick={handleLike} disabled={isLoading}>
            <HeartIcon 
              isFilled={likeStatus?.hasLiked} 
              isLoading={isLikeStatusLoading || isLoading} 
            />
            <span>{isLikeStatusLoading ? '...' : (likeStatus?.likesCount || 0)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}