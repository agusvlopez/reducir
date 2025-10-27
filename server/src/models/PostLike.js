import mongoose from "mongoose";

const PostLikeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Índice único compuesto para evitar que un usuario dé like al mismo post más de una vez
PostLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

const PostLike = mongoose.model('PostLike', PostLikeSchema, 'post_likes');

export default PostLike;