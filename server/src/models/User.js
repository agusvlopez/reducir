import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  carbon: {
    type: Number,
    required: true,
    default: 0
  },
  followers: {
    type: [String],
    default: []
  },
  following: {
    type: [String],
    default: []
  },
  actions_saved: {
    type: [String],
    default: []
  },
  actions_achieved: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;

