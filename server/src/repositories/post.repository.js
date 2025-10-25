import cloudinary from "../config/cloudinary.js";
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import Post from "../models/Post.js";

export class PostRepository {
  static async create({ userId, actionId, carbon_reduced, userInfo, category, content, image }) {   
    try {
      let imageUrl = null;

      if (image) {
        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: 'posts', 
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' }, 
            { quality: 'auto' } 
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

  //TODO: finish it
  static async update({userId, actionId, carbon_reduced, userInfo, category, content, image}) {
    try {
      //opcionales
      const updateData = {};
      if (userId) updateData.userId = userId;
      if (actionId) updateData.actionId = actionId;
      if (carbon_reduced) updateData.carbon_reduced = carbon_reduced;
      if (userInfo) updateData.userInfo = userInfo;
      if (category) updateData.category = category;
      if (content) updateData.content = content;
      if (image) updateData.image = image;

      const updatedPost = await Post.findOneAndUpdate(
        { userId, actionId },
        updateData,
        { new: true, runValidators: true }
      );

      return updatedPost;
    } catch (error) {}
  }

  static async findById({ postId }) {
    try {
      const post = await Post.findOne({ _id: postId, isDeleted: false })
      .populate('userId', 'name username image')
      .lean();
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

  static async findByUserId({ userId }) {
    try {
      const posts = await Post.find({ userId, isDeleted: false })
      .populate('userId', 'name username image')
      .lean();
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

  static async findAll() {
    try {
      const posts = await Post.find({ isDeleted: false })
        .populate('userId', 'name username image')
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();

      return posts;
    } catch (error) {
      return null;
    }
  }

  static async softDelete({ postId, userId }) {
    try {
      const updatedPost = await Post.findOneAndUpdate(
        { 
          _id: postId,
          userId: userId,  // Solo actualiza si el userId coincide
          isDeleted: false // Evita eliminar algo ya eliminado
        },
        { isDeleted: true },
        { new: true, runValidators: true }
      );
      
      if (!updatedPost) {
        // No sabemos si no existe o no tiene permisos
        const post = await Post.findById(postId);
        
        if (!post) {
          throw new NotFoundError('No se encontró el post');
        }
        
        if (post.userId.toString() !== userId.toString()) {
          throw new ForbiddenError('No tienes permiso para eliminar este post');
        }
        
        if (post.isDeleted) {
          throw new ValidationError('Este post ya fue eliminado');
        }
      }
      
      return updatedPost;
    } catch (error) {
      if (error.name === 'NotFoundError' || 
          error.name === 'ForbiddenError' || 
          error.name === 'ValidationError') {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      throw error;
    }
  }

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