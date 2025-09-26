import { createContext } from "react";
import { useToggleLikePostMutation } from "../api/postsSlice";
import { useAuth } from "../hooks/useAuth";

const FavoritePostsContext = createContext();

export const FavoritePostsProvider = ({ children }) => {
  const { userId } = useAuth();

  const [toggleLikePost] = useToggleLikePostMutation();

  const toggleFavoritePost = async (postId) => {   
    try {
      await toggleLikePost({ postId, userId }).unwrap();
    } catch (error) {
      console.error(error);
    }
  }

  const contextValue = {
    toggleFavoritePost
  }

  return (
    <FavoritePostsContext.Provider value={contextValue}>
      {children}
    </FavoritePostsContext.Provider>
  );
}

export default FavoritePostsContext;