import { ValidationError } from "../errors/ValidationError.js";
import { PostCommentService } from "../services/postComment.service.js";

export class PostCommentController {
  static async create(req, res) {
    const { postId, userId, userInfo, content } = req.body;

    try {
      const comment = await PostCommentService.create({
        postId,
        userId,
        userInfo,
        content
      });
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      await PostCommentService.delete({ id });
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async findById(req, res) {
    const { id } = req.params;

    try {
      const comment = await PostCommentService.findById({ id });
      res.status(200).json(comment);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async findByPostId(req, res) {
    const { postId } = req.params;

    try {
      const comments = await PostCommentService.findByPostId({ postId });
      res.status(200).json(comments);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });      
    }
  }
}