import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ConflictError } from "../errors/ConflictError.js";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";

export class PostLikeRepository {
  //CHECKED?: ✅
  /**
  * Crea un nuevo like para un post específico
  * Debe verificar que no exista ya un like del mismo usuario para ese post
  * Incrementa automáticamente el likesCount del post correspondiente
  */
  static async create({ userId, postId }) {
    try {
      const postLike = await PostLike.create({ userId, postId });

      // Incrementa automáticamente el likesCount del post correspondiente
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: 1 } },
        { new: true, runValidators: true }
      );
      
      if(updatedPost === null) {       
        // Si el post no se encuentra, deshacemos el like creado para mantener la consistencia.
        // await PostLike.findByIdAndDelete(postLike._id);
        throw new NotFoundError('No se encontró el post para darle like.');
      }

      return postLike;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new ValidationError(`${Object.values(error.errors).map(e => e.message)}`);
      }
      // Error de duplicado (código 11000) gracias al índice único.
      if (error.code === 11000) {
        throw new ConflictError('El usuario ya le ha dado like a este post.');
      }
      throw error;
    }
  }
  //CHECKED?: ✅
  /**
  * Obtiene todos los likes que ha dado un usuario (Útil para el historial de likes del usuario)
  * 
  */
  static async findByUserId({ userId }) {
    try {
      const posts = PostLike.find({ userId });
      return posts;
    } catch (error) {
      if(error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      throw error;
    }
  }
  //CHECKED?: ✅
  /**
  * Obtiene todos los likes de un post específico (Útil para mostrar quién dio like a un post)
  */
  static async findByPostId({ postId }) {
    try {
      const posts = PostLike.find({ postId });
      return posts;
    } catch (error) {
      if(error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      throw error;
    }
  }
  //CHECKED?: ✅
  /**
  * 
  * Elimina el like de un usuario específico en un post específico (unlike)
  * Decrementa automáticamente el likesCount del post correspondiente
  */
  static async deleteByPostAndUser({ userId, postId }) {
    try {
      const postLike = await PostLike.findOneAndDelete({ userId, postId });
      //Decrementa automáticamente el likesCount del post correspondiente
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { new: true, runValidators: true }
      );
      
      if(postLike === null) {
        throw new NotFoundError('No se encontró el post');
      }
      return postLike;
    } catch (error) {
      if(error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      throw error;
    }
  }
  //CHECKED?: ✅
  static async toggleLike({ postId, userId }) {
    try {
      const postLike = await PostLike.findOne({ postId, userId });
      if(postLike) {
        await PostLike.findByIdAndDelete(postLike._id);
        //Decrementa el likesCount del post correspondiente
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $inc: { likesCount: -1 } },
          { new: true, runValidators: true }
        );
      } else {
        await PostLike.create({ userId, postId });
        //Incrementa el likesCount del post correspondiente
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $inc: { likesCount: 1 } },
          { new: true, runValidators: true }
        );
      }

      return postLike;
    } catch (error) {
      if(error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      throw error;
    }
  }

  //CHECKED?:✅
  static async existsLike({ postId, userId }) {
    try {
      const postLike = await PostLike.findOne({ postId, userId });
      if(postLike === null) {
        throw new NotFoundError('No se encontró el post o el usuario');
      }
      return postLike !== null;
    } catch (error) {
      if(error.name === 'CastError') {
        throw new ValidationError('ID inválido');
      }
      throw error;
    }
  }



  


}