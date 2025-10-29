import mongoose from "mongoose";
import findOrCreate from 'mongoose-findorcreate';

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
    required: false  // Cambiar a false porque usuarios de Google no tienen password
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
  googleId: {
    type: String,
    unique: true,  // Agregar unique
    sparse: true   // Permite que sea opcional pero único cuando existe
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema);

export default User;