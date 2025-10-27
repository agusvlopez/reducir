import mongoose, { Schema } from "mongoose";

const FollowSchema = new Schema({
  follower: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  following: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Índice para evitar duplicados y mejorar queries
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model('Follow', FollowSchema);

export default Follow;