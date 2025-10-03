import PostCommentLike from "../models/PostCommentLike.js";
import PostComment from "../models/PostComment.js";

export class PostCommentLikeRepository {
  static async toggleLike({ commentId, userId }) {
    try {
      const like = await PostCommentLike.findOne({ commentId, userId });

      if (like) {
        // Like exists, so remove it
        await PostCommentLike.findByIdAndDelete(like._id);
        await PostComment.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } });
        return { liked: false };
      } else {
        // Like does not exist, so create it
        await PostCommentLike.create({ commentId, userId });
        await PostComment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });
        return { liked: true };
      }
    } catch (error) {
      throw new Error('Error toggling post comment like: ' + error.message);
    }
  }

  static async existsLike({ commentId, userId }) {
    const like = await PostCommentLike.findOne({ commentId, userId });
    return !!like;
  }
}