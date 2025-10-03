import { PostCommentLikeService } from "../services/postCommentLike.service.js";

export class PostCommentLikeController {
  static async toggleLike(req, res) {
    const { commentId, userId } = req.body;
    try {
      const postCommentLike = await PostCommentLikeService.toggleLike({ commentId, userId });
      res.status(201).json(postCommentLike);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async existsLike(req, res) {
    const { commentId, userId } = req.params;
    try {
      const exists = await PostCommentLikeService.existsLike({ commentId, userId });
      res.status(200).json(exists);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}