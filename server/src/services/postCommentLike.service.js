import { PostCommentRepository } from "../repositories/postComment.repository.js";
import { PostCommentLikeRepository } from "../repositories/postCommentLike.repository.js";

export class PostCommentLikeService {
  // Dar like
  static async toggleLike(commentId, userId) {
    // Verificar que el comentario existe
    const comment = await PostCommentRepository.findById({ id: commentId });
    console.log("comment",comment);
    
    if (!comment) {
      throw new Error('Comentario no encontrado');
    }

    // Verificar si ya dio like
    const existingLike = await PostCommentLikeRepository.findByCommentAndUser(
      commentId,
      userId
    );

    if (existingLike) {
      // Si ya existe, quitar like (unlike)
      await PostCommentLikeRepository.delete(commentId, userId);
      await PostCommentRepository.decrementLikesCount(commentId);
      
      return { liked: false, message: 'Like eliminado' };
    } else {
      // Si no existe, dar like
      await PostCommentLikeRepository.create(commentId, userId);
      await PostCommentRepository.incrementLikesCount(commentId);
      
      return { liked: true, message: 'Like agregado' };
    }
  }

  // Verificar si el usuario dio like
  static async hasUserLiked(commentId, userId) {
    const like = await PostCommentLikeRepository.findByCommentAndUser(
      commentId,
      userId
    );
    return !!like;
  }

  // Obtener cantidad de likes
  static async getLikesCount(commentId) {
    return await PostCommentLikeRepository.countByComment(commentId);
  }
}