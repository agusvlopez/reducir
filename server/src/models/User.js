import mongoose from "mongoose";
import findOrCreate from 'mongoose-findorcreate';


const HabitSchema = new mongoose.Schema({
  id: { type: String, required: true },
  frequency: { type: String, enum: ['EveryDay', 'SixAWeek', 'FiveAWeek', 'FourAWeek', 'ThreeAWeek', 'TwoAWeek', 'OnceAWeek', 'OnceAFortnight', 'OnceAMonth'], required: true },
  progress: { type: Number, default: 0 },
  co2ReductionPerAction: { type: Number, default: 0 },
  co2ReductionTotal: { type: Number, default: 0 }
}, { _id: false });


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
  carbonFootprintYearly: {
    type: Number,
    required: true,
    default: 0
  },
  carbonFootprintMonthly: {
    type: Number,
    required: true,
    default: 0
  },
  monthlyFootprints: [{
    month: { type: String, required: true }, // formato: "2025-11"
    value: { type: Number, required: true }, // huella en kg CO₂
    reduction: { type: Number, default: 0 }  // opcional: ahorro respecto al mes anterior
  }],
  actions_saved: {
    type: [String],
    default: []
  },
  actions_achieved: {
    type: [HabitSchema],
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
    unique: true, 
    sparse: true  // Permite que sea opcional pero único cuando existe
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema);

export default User;