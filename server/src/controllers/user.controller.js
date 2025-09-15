import { ConflictError } from "../errors/ConflictError.js";
import { ValidationError } from "../errors/ValidationError.js";
import User from "../models/User.js";
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
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201).json({ userId, accessToken }); 
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
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        })
        .status(200).json({ user, accessToken });
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
      const { refreshToken } = req.cookies;

      if (refreshToken) {
        // TODO: HACER ESTO EN User.SERVICE
        await TokenService.delete({ refreshToken });
      }
      
      res
        .clearCookie('refreshToken', { 
          httpOnly: true, 
          sameSite: "None",
          secure: true,
        })
        .status(200)
        .json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'Could not log out, please try again.' });
    }
  }

  static async toggleFavoriteAction(req, res) {
    console.log("favorties", req.body);
    
    const { userId, actionId } = req.body;
    try {
      const updatedUser = await UserService.toggleFavoriteAction({ userId, actionId });
      res.status(200).json(updatedUser);
    } catch (error) {
    }
  }

}