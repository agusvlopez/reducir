import { TokenService } from "../services/token.service.js";

export class TokenController {
  static async create(req, res) { 
    const { refresh_token: refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    try {
      const { accessToken, updatedRefreshToken } = await TokenService.createToken({ refreshToken });
      
      // res
      //   .cookie('access_token', accessToken, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === 'production',
      //     sameSite: 'strict',
      //     maxAge: 60 * 60 * 1000
      //   })
      //   .status(200)
      //   .json({ accessToken });

      // Update the refresh token cookie
      res.cookie('refresh_token', updatedRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // path: '/tokens'
      });

      res.status(201).json({ accessToken });
    } catch (error) {
      if (error instanceof ValidationError) return res.status(401).send(error.message);
      return res.status(500).send({ message: 'An unexpected error occurred on the server.' });
    }
  }
}