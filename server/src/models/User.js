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
  actions_saved: {
    type: [String],
    default: []
  },
  actions_achieved: {
    type: [String],
    default: []
  },
  carbonGoal: {
    year: Number,
    targetReductionPercentage: Number,
    baselineValue: Number,
    targetValue: Number,
    startDate: Date,
    completedAt: Date,
    status: { type: String, enum: ['inactive', 'active', 'completed', 'abandoned'], default: 'inactive' }
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;

