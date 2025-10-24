import mongoose, { Schema } from "mongoose";

const FollowSchema = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // quien sigue
  following: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // a quien sigue
  createdAt: { type: Date, default: Date.now }
});

// Índice para evitar duplicados y mejorar queries
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model('Follow', FollowSchema);

export default Follow;