import PostCommentLike from "../models/PostCommentLike.js";


export class PostCommentLikeRepository {
  static async create(commentId, userId) {
    return await PostCommentLike.create({
      commentId,
      userId
    });
  }

  static async delete(commentId, userId) {
    return await PostCommentLike.findOneAndDelete({
      commentId,
      userId
    });
  }

  static async findByCommentAndUser(commentId, userId) {
    return await PostCommentLike.findOne({
      commentId,
      userId
    });
  }

  static async countByComment(commentId) {
    return await PostCommentLike.countDocuments({ commentId });
  }
};