import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { PostLikeService } from "../services/postLike.service.js";

export class PostLikeController {
  //CHECKED?: ✅
  static async create(req, res) {
    const { userId, postId } = req.body;
    try {
      const postLike = await PostLikeService.create({ userId, postId });
      res.status(201).json(postLike);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ConflictError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }
  //CHECKED?: ✅
  static async findByUserId(req, res) {
    const { userId } = req.params;

    try {
      const posts = await PostLikeService.findByUserId({ userId });
      res.status(200).json(posts);
    } catch (error) {
      if(error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }
  //CHECKED?: ✅
  static async findByPostId(req, res) {
    const { postId } = req.params;

    try {
      const posts = await PostLikeService.findByPostId({ postId });
      res.status(200).json(posts);
    } catch (error) {
      if(error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }
  //CHECKED?: ✅
  static async deleteByPostAndUser(req, res) {
    const { userId, postId } = req.params;

    try {
      const postLike = await PostLikeService.deleteByPostAndUser({ userId, postId });
      res.status(200).json(postLike);
    } catch (error) {
      if(error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if(error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }
  //CHECKED?: ✅
  static async toggleLike(req, res) {
    const { postId, userId } = req.params;

    try {
      const postLike = await PostLikeService.toggleLike({ postId, userId });
      res.status(200).json(postLike);
    } catch (error) {
      if(error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if(error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }
  //CHECKED?: ✅
  static async existsLike(req, res) {
    const { postId, userId } = req.params;

    try {
      const postLike = await PostLikeService.existsLike({ postId, userId });
      res.status(200).json(postLike);
    } catch (error) {
      if(error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if(error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

}