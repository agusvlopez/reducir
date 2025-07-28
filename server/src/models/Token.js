import mongoose from "mongoose";

const TokenSchema = mongoose.Schema({
  refreshToken: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  }
});

const Token = mongoose.model('Token', TokenSchema);

export default Token;