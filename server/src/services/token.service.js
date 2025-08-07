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
    const foundToken = await TokenRepository.findByToken({ refreshToken });
    if (!foundToken) {
      throw new ValidationError('Refresh token no válido o reutilizado.');
    }

    let userPayload;
    try {
      userPayload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      await this.delete({ refreshToken });
      throw new ValidationError('Sesión expirada. Por favor, inicie sesión de nuevo.');
    }

    if (foundToken.userId.toString() !== userPayload.id) {
      throw new ValidationError('Refresh Token no coincide con el usuario.');
    }

    await this.delete({ refreshToken });

    const newAccessToken = jwt.sign(
      { id: userPayload.id, email: userPayload.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const newRefreshToken = jwt.sign(
      { id: userPayload.id, email: userPayload.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await this.create({ refreshToken: newRefreshToken, userId: userPayload.id, userEmail: userPayload.email });

    return { accessToken: newAccessToken, updatedRefreshToken: newRefreshToken };
  }

  static async delete({ refreshToken }) {
    return TokenRepository.deleteByToken({ refreshToken });
  }
}
