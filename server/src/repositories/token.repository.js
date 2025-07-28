import Token from "../models/Token.js";

export class TokenRepository {
  static async create({ refreshToken, userId, userEmail }) {
    const newToken = await Token.create({
      refreshToken,
      userId,
      userEmail
    });
    return newToken;
  }

  static async findByToken({ refreshToken }) {
    const token = await Token.findOne({ refreshToken }).lean();
    return token;
  }

  static async deleteByToken({ refreshToken }) {
    return Token.deleteOne({ refreshToken });
  }
}