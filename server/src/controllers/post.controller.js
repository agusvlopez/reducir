import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { PostService } from "../services/post.service.js";

export class PostController {

  static async create(req, res) {
    const { userId, actionId, carbon_reduced, category, content } = req.body;
    const userInfo = JSON.parse(req.body.userInfo);

    let imageBase64 = null;
    if (req.file) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    try {
      const post = await PostService.create({ 
        userId,
        actionId, 
        carbon_reduced,
        userInfo,
        category, 
        content, 
        image: imageBase64 
      });
      res.status(201).json(post);
    } catch (error) {      
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async findById(req, res) {
    const { postId } = req.params;

    try {
      const post = await PostService.findById({ postId });
      res.status(200).json(post);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async findByUserId(req, res) {
    const { userId } = req.params;
    try {
      const posts = await PostService.findByUserId({ userId });
      res.status(200).json(posts);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async findAll(req, res) {
    try {
      const posts = await PostService.findAll();
      res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async getFeed(req, res) {
    try {
      const { userId } = req.params;
      
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      // Validaciones
      if (page < 1) {
        return res.status(400).json({ 
          message: 'El número de página debe ser mayor a 0' 
        });
      }
      
      if (limit < 1 || limit > 100) {
        return res.status(400).json({ 
          message: 'El límite debe estar entre 1 y 100' 
        });
      }
      
      const result = await PostService.getFeed({ 
        userId, 
        page, 
        limit 
      });
      
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message });
      }
      
      console.error('Error en getFeed:', error);
      res.status(500).json({ 
        message: 'Error al obtener el feed de posts' 
      });
    }
  }

  static async deleteById(req, res) {
    const { postId, userId } = req.params;

    try {
      const result = await PostService.deleteById({ postId, userId });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async incrementLikesCount(req, res) {
    const { postId } = req.params;

    try {
      const updatedPost = await PostService.incrementLikesCount({ postId });
      res.status(200).json(updatedPost);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async decrementLikesCount(req, res) {
    const { postId } = req.params;

    try {
      const updatedPost = await PostService.decrementLikesCount({ postId });
      res.status(200).json(updatedPost);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

}