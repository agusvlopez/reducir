import { PostCommentLikeService } from "../services/postCommentLike.service.js";

export class PostCommentLikeController {
  static async toggleLike(req, res) {
    try {      
      const { commentId } = req.params;
      const { userId } = req.query;

      const result = await PostCommentLikeService.toggleLike(commentId, userId);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getLikeStatus(req, res) {
    try {
      const { commentId } = req.params;
      const { userId } = req.query;

      const hasLiked = await PostCommentLikeService.hasUserLiked(commentId, userId);
      const likesCount = await PostCommentLikeService.getLikesCount(commentId);
      
      res.status(200).json({
        hasLiked,
        likesCount
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}