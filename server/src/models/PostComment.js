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
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostComment',
    default: null
  },
  depth: {
    type: Number,
    default: 0,
    min: 0,
    // max: 2 // Límite máximo de profundidad, para que no se haga una cadena muy larga
  },
  likesCount: {
    type: Number,
    default: 0
  },
  repliesCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const PostComment = mongoose.model('PostComment', PostCommentSchema, 'post_comments');

export default PostComment;