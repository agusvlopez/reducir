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
  }
}, { timestamps: true });

const PostCommentLike = mongoose.model('PostCommentLike', PostCommentLikeSchema);

export default PostCommentLike;