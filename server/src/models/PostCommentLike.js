import mongoose from "mongoose";

const PostCommentLikeSchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostComment',
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

const PostCommentLike = mongoose.model('PostCommentLike', PostCommentLikeSchema, 'post_comment_likes');

export default PostCommentLike;