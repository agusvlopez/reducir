import cloudinary from "../config/cloudinary.js";
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import Post from "../models/Post.js";

export class PostRepository {
  // CHECKED?: ✅
  static async create({ userId, actionId, carbon_reduced, userInfo, category, content, image }) {   
    try {
      let imageUrl = null;

      if (image) {
        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: 'posts', // Carpeta en Cloudinary
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' }, // Límite de tamaño
            { quality: 'auto' } // Optimización automática
          ]
        });
        imageUrl = uploadResult.secure_url;
      }

      const post = await Post.create({
        userId,
        actionId,
        carbon_reduced,
        userInfo,
        category,
        content,
        image: imageUrl
      });

      return post;
    } catch (error) {      
      if (error.name === 'ValidationError') {
        throw new ValidationError(`${Object.values(error.errors).map(e => e.message)}`);
      }
            
      throw error;
    }
  }
  // CHECKED?: ✅
  static async findById({ postId }) {
    try {
      const post = await Post.findById(postId).lean();
      if(post === null) {       
        throw new NotFoundError('No se encontró el post');
      }
      
      return post;
    } catch (error) {
      if(error.name === 'NotFoundError') {
        throw error;
      }
      if(error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      return null;
    }
  }
  // CHECKED?:
  static async findByUserId({ userId }) {
    try {
      const posts = await Post.find({ userId }).lean();
      if(posts.length === 0) {       
        throw new NotFoundError('No se encontraron posts para este usuario');
      }
      
      return posts;
    } catch (error) {
      if(error.name === 'NotFoundError') {
        throw error;
      }
      if(error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      return null;
    }
  }
  // CHECKED?:✅
  static async findAll() {
    try {
      const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

      return posts;
    } catch (error) {
      return null;
    }
  }
  // CHECKED?:✅
  static async deleteById({ postId }) {
    try {
      const result = await Post.findByIdAndDelete(postId);
      if(result === null) {       
        throw new NotFoundError('No se encontró el post');
      }
      
      return result;
    } catch (error) {
      if(error.name === 'NotFoundError') {
        throw error;
      }
      if(error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      return null;
    }
  }
  // CHECKED?: ✅
  static async incrementLikesCount({ postId }) {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: 1 } },
        { new: true, runValidators: true }
      );
      if(updatedPost === null) {       
        throw new NotFoundError('No se encontró el post');
      }

      return updatedPost;
    } catch (error) {
      if(error.name === 'NotFoundError') {
        throw error;
      }
      if(error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      return null;
    }
  }
  // CHECKED?: ✅
  static async decrementLikesCount({ postId }) {
    try {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, likesCount: { $gt: 0 } }, // solo si > 0
        { $inc: { likesCount: -1 } },
        { new: true, runValidators: true }
      );

      if(updatedPost === null) {       
        throw new NotFoundError('No se encontró el post o likesCount ya es 0');
      }
      
      return updatedPost;
    } catch (error) {
      if(error.name === 'NotFoundError') {
        throw error;
      }
      if(error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      return null;
    }
  }

  static async incrementCommentsCount(postId) {
    return await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } },
      { new: true } // Retorna el documento actualizado
    );
  }

  static async decrementCommentsCount(postId) {
    return await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: -1 } },
      { new: true }
    );
  }  
} 