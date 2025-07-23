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
    type: String
  },
  carbon: {
    type: Number,
    required: true
  },
  achievements: {
    type: [String]
  },
  actions: {
    type: [String]
  },
  followers: {
    type: [String]
  },
  following: {
    type: [String]
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;

