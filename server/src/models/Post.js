import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum:{
      values: ['energía', 'transporte', 'reciclaje', 'alimentación', 'agua', 'otros'],
      message: 'Categoría inválida. Deber ser una de: energía, transporte, reciclaje, alimentación, agua, otros.'
    }
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

export default Post;