import { PostRepository } from "../repositories/post.repository.js";
import { PostCommentRepository } from "../repositories/postComment.repository.js";

export class PostCommentService {
  static async create({ postId, userId, userInfo, content, parentCommentId}) {
    let depth = 0;
    
    // Lógica para calcular depth
    if (parentCommentId) {
      const parentComment = await PostCommentRepository.findById({ id: parentCommentId });
      console.log(parentComment);
      
      if (!parentComment) {
        throw new Error('Comentario padre no encontrado');
      }
      
      depth = parentComment.depth + 1;
      
      // Validación de profundidad máxima
      if (depth > 2) {
        throw new Error('Máximo 2 niveles de respuestas permitidos');
      }
      //todo: chequear si es necesario:

      // Incrementar contador de respuestas del padre
     await PostCommentRepository.incrementRepliesCount(parentCommentId);
    }
    try {
      const postComment = await PostCommentRepository.create({
        postId,
        userId,
        userInfo,
        content,
        parentCommentId,
        depth  
      });
      
      // Incrementar contador de comentarios del post
      await PostRepository.incrementCommentsCount(postId);

      return postComment;
    } catch (error) {
      throw error;
    }
  }

  static async delete({ id }) {
    try {
      const postComment = await PostCommentRepository.delete({ id });
      return postComment;
    } catch (error) {
      throw error;
    }
  }

  static async findById({ id }) {
    try {
      const postComment = await PostCommentRepository.findById({ id });
      return postComment;
    } catch (error) {
      throw error;
    }
  }

  static async findByPostId({ postId }) {
    try {
      const postComments = await PostCommentRepository.findByPostId({ postId });
      return postComments;
    } catch (error) {
      throw error;
    }
  }
}