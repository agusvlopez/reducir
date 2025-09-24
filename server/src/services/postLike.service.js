import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { PostLikeRepository } from "../repositories/postLike.repository.js";

export class PostLikeService {
  //CHECKED?: ✅
  static async create({ userId, postId }) {
    try {
      const postLike = await PostLikeRepository.create({ userId, postId });
      return postLike;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError || error instanceof NotFoundError) {
        throw error;
      }
      throw error;
    }
  }
  //CHECKED?: ✅
  static async findByUserId({ userId }) {
    try {
      const posts = await PostLikeRepository.findByUserId({ userId });
      return posts;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw error;
    }
  }
  //CHECKED?: ✅
  static async findByPostId({ postId }) {
    try {
      const posts = await PostLikeRepository.findByPostId({ postId });
      return posts;
    } catch (error) {
      if(error instanceof ValidationError) {
        throw error;
      }
      throw error;
    }
  }
  //CHECKED?: ✅
  static async deleteByPostAndUser({ userId, postId }) {
    try {
      const postLike = await PostLikeRepository.deleteByPostAndUser({ userId, postId });
      return postLike;
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
  //CHECKED?: ✅
  static async toggleLike({ postId, userId }) {
    try {
      const postLike = await PostLikeRepository.toggleLike({ postId, userId });
      return postLike;
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
  //CHECKED?:✅
  static async existsLike({ postId, userId }) {
    try {
      const postLike = await PostLikeRepository.existsLike({ postId, userId });
      return postLike;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw error;
    }
  }

}