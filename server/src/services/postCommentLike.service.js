import { PostCommentLikeRepository } from "../repositories/postCommentLike.repository.js";

export class PostCommentLikeService {
  static async toggleLike({ commentId, userId }) {
    return await PostCommentLikeRepository.toggleLike({ commentId, userId });
  }
  static async existsLike({ commentId, userId }) {
    return await PostCommentLikeRepository.existsLike({ commentId, userId });
  }
}