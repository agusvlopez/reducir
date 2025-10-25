import { PostRepository } from "../repositories/post.repository.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class PostService {

  static async create({ userId, actionId, carbon_reduced, userInfo, category, content, image}) {
    try {
      const post = await PostRepository.create({ userId, actionId, carbon_reduced, userInfo, category, content, image });
      return post;
    } catch (error) {
      throw error;
    }
  }

  static async findById({ postId }) {
    try {
      const post = await PostRepository.findById({ postId });
      return post; 
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      throw error;
    }
  }

  static async findByUserId({ userId }) {
    try {
      const posts = await PostRepository.findByUserId({ userId });
      return posts;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw error;
    }
  }

  static async findAll() {
    try {
      const posts = await PostRepository.findAll();
      return posts;
    } catch (error) {
      throw error;
    }
  }

  static async deleteById({ postId, userId }) {
    try {
      const result = await PostRepository.softDelete({ postId, userId });
      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      throw error;
    }
  }

  static async incrementLikesCount({ postId }) {
    try {
      const updatedPost = await PostRepository.incrementLikesCount({ postId });
      return updatedPost;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      throw error;
    }
  }

  static async decrementLikesCount({ postId }) {
    try {
      const updatedPost = await PostRepository.decrementLikesCount({ postId });
      return updatedPost;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      throw error;
    }
  }

}