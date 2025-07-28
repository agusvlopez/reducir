import { TokenService } from "../services/token.service.js";

export class TokenController {
  static async create(req, res) { // Renamed to refresh for clarity
    const { refresh_token: refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    try {
      const { accessToken } = await TokenService.createAccessToken({ refreshToken });
      
      res
        .cookie('access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000
        })
        .status(200)
        .json({ accessToken });
    } catch (error) {
      if (error instanceof ValidationError) return res.status(401).send(error.message);
      return res.status(500).send({ message: 'An unexpected error occurred on the server.' });
    }
  }
}