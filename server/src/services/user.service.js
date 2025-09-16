import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/user.repository.js";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, SALT_ROUNDS } from "../config.js";
import { validateUserCreate, validateUserLogin } from "../validations/user.schema.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ConflictError } from "../errors/ConflictError.js";
import { TokenService } from './token.service.js';

export class UserService {
  static async create({ name, username, email, password }){
    const validationResult = validateUserCreate({ name, username, email, password });
    if (validationResult.error) throw new ValidationError(validationResult.error.message);

    const userExists = await UserRepository.exists({ email });
    if (userExists) throw new ConflictError('El email ya está en uso');

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await UserRepository.create({
      name,
      username,
      email,
      hashedPassword
    });

    if(!user) throw new ValidationError('No se pudo crear el usuario');

    // Access Token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email}, 
      ACCESS_TOKEN_SECRET, 
      {  expiresIn: '1h' }
    );

    // Refresh token
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email}, 
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // save refresh token in database
    await TokenService.create({
      refreshToken,
      userId: user._id,
      userEmail: user.email
    });

    return { userId: user._id, accessToken, refreshToken };
  }

  static async login({ email, password }){
    const validationResult = validateUserLogin({ email, password });
    if(validationResult.error) throw new ValidationError(validationResult.error.message);

    const user = await UserRepository.findByEmail({ email });
    if(!user) throw new ValidationError('Credenciales inválidas');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) throw new ValidationError('Credenciales inválidas');

    // Access Token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email}, 
      ACCESS_TOKEN_SECRET, 
      {  expiresIn: '1h' }
    );

    // Refresh token
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email}, 
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // save refresh token in database
    await TokenService.create({
      refreshToken,
      userId: user._id,
      userEmail: user.email
    });

    const { password: _, ...publicUser } = user;
    
    return { user: publicUser, accessToken, refreshToken };
  }

  static async toggleFavoriteAction({ userId, actionId }){
    const updatedUser = await UserRepository.toggleFavoriteAction({ userId, actionId });
    return updatedUser;
  } 
}
