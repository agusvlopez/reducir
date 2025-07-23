import { ConflictError } from "../errors/ConflictError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { UserService } from "../services/user.service.js";

export class UserController {
  static async create(req, res) {
    const { name, username, email, password } = req.body;
  
    try {
      const { userId, token } = await UserService.create({ 
        name, 
        username, 
        email, 
        password 
      });
  
      res
        .cookie('access_token', token, {
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000 
        })
        .status(201)
        .send({ userId, token });
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
      const { user, token } = await UserService.login({ email, password });
  
      res
        .cookie('access_token', token, {
          httpOnly: true, // cookie access only in server
          secure: process.env.NODE_ENV === 'production', // cookie access only in https
          sameSite: 'strict', //cookie access only in the same domain/site
          maxAge: 60 * 60 * 1000 // validate for 1 hour
        })
        .send({ user, token });
  
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

  static logout(req, res) {
    try {
      res
        .clearCookie('access_token')
        .status(200)
        .json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'Could not log out, please try again.' });
    }
  }
}