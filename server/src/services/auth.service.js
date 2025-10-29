import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { TokenService } from './token.service.js';

export class AuthService {
  static async handleGoogleAuth(profile) {
    try {
      // Buscar usuario existente
      let user = await AuthRepository.findUserByGoogleIdOrEmail(
        profile.id,
        profile.emails[0].value
      );
      
      if (!user) {
        // Crear nuevo usuario
        user = await AuthRepository.createGoogleUser({
          name: profile.displayName,
          username: profile.emails[0].value.split('@')[0],
          email: profile.emails[0].value,
          googleId: profile.id,
          image: profile.photos[0]?.value,
        });
      } else if (!user.googleId) {
        // Vincular cuenta de Google a usuario existente
        user = await AuthRepository.linkGoogleAccount(
          user,
          profile.id,
          profile.photos[0]?.value
        );
      }
      
      // Generar tokens JWT
      const tokens = this.generateTokens(user);
      
      // Guardar refresh token en la BD
      await TokenService.create({
        refreshToken: tokens.refreshToken,
        userId: user._id,
        userEmail: user.email
      });

      return {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };
      
    } catch (error) {
      throw error;
    }
  }

  static generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user._id, email: user.email }, 
      ACCESS_TOKEN_SECRET, 
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email }, 
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}