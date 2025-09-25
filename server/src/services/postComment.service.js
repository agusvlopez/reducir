import { PostCommentRepository } from "../repositories/postComment.repository.js";

export class PostCommentService {
  static async create({ postId, userId, userInfo, content }) {
    try {
      const postComment = await PostCommentRepository.create({
        postId,
        userId,
        userInfo,
        content,
      });
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