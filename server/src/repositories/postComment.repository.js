import Post from "../models/Post.js";
import PostComment from "../models/PostComment.js";

export class PostCommentRepository {
  static async create({ postId, userId, userInfo, content }) {   
    try {
      const postComment = await PostComment.create({
        postId,
        userId,
        userInfo,
        content,
      });
      //Incrementa automáticamente el commentsCount del post correspondiente
      await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

      return postComment;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new ValidationError(`${Object.values(error.errors).map(e => e.message)}`);
      }
            
      throw error;      
    }
  }

  static async delete({ id }) {
    try {
      const postComment = await PostComment.findByIdAndDelete(id);
      //Decrementa automáticamente el commentsCount del post correspondiente
      await Post.findByIdAndUpdate(postComment.postId, { $inc: { commentsCount: -1 } });

      return postComment;
    } catch(error) {
      if (error.name === 'ValidationError') {
        throw new ValidationError(`${Object.values(error.errors).map(e => e.message)}`);
      }
      throw error;
    }
  }

  static async findById({ id }) {
    try {
      const postComment = await PostComment.findById(id);
      return postComment;
    } catch(error) {
      if (error.name === 'ValidationError') {
        throw new ValidationError(`${Object.values(error.errors).map(e => e.message)}`);
      }            
      throw error;  
    }
  }

  /**
  * 
  * Obtiene todos los comentarios de un post específico
  * Ordenados por fecha (más recientes primero o más antiguos primero)
  */
  static async findByPostId({ postId }) {
    try {
      const postComments = await PostComment.find({ postId }).sort({ createdAt: -1 });
      return postComments;
    } catch(error) {
      if (error.name === 'ValidationError') {
        throw new ValidationError(`${Object.values(error.errors).map(e => e.message)}`);
      }            
      throw error;
    }
  }
}