import { ValidationError } from "../errors/ValidationError.js";
import { TokenService } from "../services/token.service.js";

export class TokenController {
  static async create(req, res) {    
    const { refreshToken: refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    try {
      const { accessToken, updatedRefreshToken, userId } = await TokenService.createToken({ refreshToken });

      // Update the refresh token cookie
      res.cookie('refreshToken', updatedRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // path: '/tokens'
      });

      res.status(201).json({ accessToken, userId });
    } catch (error) {
      if (error instanceof ValidationError) return res.status(401).send(error.message);
      return res.status(500).send({ message: 'An unexpected error occurred on the server.' });
    }
  }
}