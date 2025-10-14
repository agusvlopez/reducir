import { ConflictError } from "../errors/ConflictError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
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

  static async createCarbon(req, res) {
    const { userId, carbon } = req.body;
    
    try {
      const updatedUser = await UserService.createCarbon({ userId, carbon });
      res.status(200).json({
        success: true,
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false
      })
    }
  }

  static async toggleFavoriteAction(req, res) {    
    const { userId, actionId } = req.body;
    
    try {
      const updatedUser = await UserService.toggleFavoriteAction({ userId, actionId });
      res.status(200).json(updatedUser);
    } catch (error) {}
  }
  
  static async checkFavoriteAction(req, res) {
    const { userId, actionId } = req.params;
    
    try {
      const isFavorite = await UserService.checkFavoriteAction({ userId, actionId });
      res.status(200).json(isFavorite);
    } catch (error) {
    }
  }

  static async getSavedActions(req, res) {
    const { userId } = req.params;

    try {
      const favoriteActions = await UserService.getSavedActions(userId);
      res.status(200).json(favoriteActions);
    } catch (error) {
      if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async findById(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserService.findById({ id: userId });
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }
  //TODO: CHECK
  static async addAchievedAction(req, res) {
    const { userId, actionId, carbon } = req.body;

    try {
      const updatedUser = await UserService.addAchievedAction({ userId, actionId, carbon });
      res.status(200).json(updatedUser);
    } catch (error) {
      if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async checkAchievedAction(req, res) {
    const { userId, actionId } = req.params;

    try {
      const isAchieved = await UserService.checkAchievedAction({ userId, actionId });
      res.status(200).json(isAchieved);
    } catch (error) {
      if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async checkCarbon(req, res) {
    const { userId } = req.params;

    try {
      const carbon = await UserService.checkCarbon({ userId });
      res.status(200).json(carbon);
    } catch (error) {}
  }

}