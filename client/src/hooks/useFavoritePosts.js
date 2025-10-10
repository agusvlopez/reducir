import { useContext, useState } from "react";
import FavoritePostsContext from "../context/FavoritePostsContext";
import { useAuth } from "./useAuth";
import { useExistsLikePostQuery } from "../api/postsSlice";


export const useFavoritePosts = () => {
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const context = useContext(FavoritePostsContext);

  if (!context) {
    throw new Error('useFavorites must be used within a ActionsSavedProvider');
  }

  const { toggleFavoritePost } = context;

  const handleToggleFavoritePost = async (postId) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await toggleFavoritePost(postId);

    } catch (error) {
      console.error("Error toggling favorite post:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  return {
    favoritePosts,
    handleToggleFavoritePost,
    isProcessing,
  };
}

export const useFavoritePostStatus = (postId) => {
  const { userId } = useAuth();
  
  const { data: isLiked, isLoading } = useExistsLikePostQuery({ postId, userId });

  return { isLiked, isLoading };
};
