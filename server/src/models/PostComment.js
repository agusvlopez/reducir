import mongoose from "mongoose";

const PostCommentSchema = new mongoose.Schema({
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
  userInfo: {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    profileImage: {
      type: String
    }
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

const PostComment = mongoose.model('PostComment', PostCommentSchema);

export default PostComment;