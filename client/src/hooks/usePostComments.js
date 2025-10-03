
import { useCreatePostCommentMutation } from "../api/postsSlice";
import { useAuth } from "./useAuth";

export const usePostComments = () => {
  const [createPostComment] = useCreatePostCommentMutation();

  const {userId, user} = useAuth();
  const userInfo = {
    name: user?.name,
    username: user?.username,
    profileImage: user?.profileImage
  }

  // Implement the hook logic here
  const createComment = async ({
    postId,
    content
  }) => {
    // Logic to create a comment
    await createPostComment({
      postId,
      userId,
      userInfo,
      content
    }).unwrap();
    // Optionally return something or handle post-creation logic
    return;
  };

  
  return { createComment };

}