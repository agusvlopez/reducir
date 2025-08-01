import { ConflictError } from "../errors/ConflictError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { TokenService } from "../services/token.service.js";

import { UserService } from "../services/user.service.js";

export class UserController {
  static async create(req, res) {
    const { name, username, email, password } = req.body;
  
    try {
      const { userId, accessToken, refreshToken } = await UserService.create({ 
        name, 
        username, 
        email, 
        password 
      });
  
      res
        // .cookie('access_token', accessToken, {
        //   httpOnly: true, 
        //   secure: process.env.NODE_ENV === 'production', 
        //   sameSite: 'strict',
        //   maxAge: 60 * 60 * 1000 
        // })
        .cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/tokens' // IMPORTANT: Only send to the token refresh path
        })
        .status(201)
        .send({ userId, accessToken }); 
    } catch (error) {
      if (error instanceof ConflictError) {
        return res.status(409).send(error.message);
      }
      if (error instanceof ValidationError) {
        return res.status(400).send(error.message);
      }      
      return res.status(500).send({ message: 'Ocurrió un error inesperado en el servidor.' });
    }  
  }

  static async login(req, res) {
    const { email, password } = req.body;
    
    try {
      const { user, accessToken, refreshToken } = await UserService.login({ email, password });
  
      res
        // .cookie('access_token', accessToken, {
        //   httpOnly: true, // cookie access only in server
        //   secure: process.env.NODE_ENV === 'production', // cookie access only in https
        //   sameSite: 'strict', //cookie access only in the same domain/site
        //   maxAge: 60 * 60 * 1000 // validate for 1 hour
        // })
        .cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          // path: '/tokens'
        })
        .send({ user, accessToken });
      
      res.status(200).json({ accessToken });
    } catch (error) {
      if (error instanceof ConflictError) {
        return res.status(409).send(error.message);
      }
      if (error instanceof ValidationError) {
        return res.status(400).send(error.message);
      }
      return res.status(500).send({ message: 'Ocurrió un error inesperado en el servidor.' });
    }
  }

  static async logout(req, res) {
    try {
      const { refresh_token } = req.cookies;
      const accessToken = req.headers["authorization"]?.split(" ")[1];

      if (refresh_token) {
        await TokenService.delete({ refreshToken: refresh_token });
      }
      
      res
        .clearCookie('refresh_token', { path: '/tokens' })
        .status(200)
        .json({ message: 'Logout successful' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Could not log out, please try again.' });
    }
  }
}