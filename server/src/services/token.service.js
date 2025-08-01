import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config.js";
import { ValidationError } from "../errors/ValidationError.js";
import { TokenRepository } from "../repositories/token.repository.js";
import jwt from 'jsonwebtoken';

export class TokenService {
  static async create({ refreshToken, userId, userEmail }) {
    const newToken = await TokenRepository.create({
      refreshToken,
      userId,
      userEmail
    });
    return newToken;
  }

  /**
  * Create new access token and new refresh token from refresh token
  */
  static async createToken({ refreshToken }) {
    // 1. find if refresh token exists in database
    const foundRefreshToken = await TokenRepository.findByToken({ refreshToken });
    if(!foundRefreshToken) throw new ValidationError('Refresh token not found');

    // 2. verify refresh token
    const user = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    );
    if(!user) throw new ValidationError('Invalid refresh token');

    // 3. generate new access token
    const { id, email } = user;

    const accessToken = jwt.sign(
      { id, email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const updatedRefreshToken = jwt.sign(
      { id, email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, updatedRefreshToken };
  }

  static async delete({ refreshToken }) {
    return TokenRepository.deleteByToken({ refreshToken });
  }
}