import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/user.repository.js";
import { JWT_KEY_SECRET, SALT_ROUNDS } from "../config.js";
import { validateUserCreate, validateUserLogin } from "../validations/user.schema.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ConflictError } from "../errors/ConflictError.js";

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

    const token = jwt.sign(
      { id: user._id, email: user.email}, 
      JWT_KEY_SECRET, 
      {  expiresIn: '1h' }
    );

    return { userId: user._id, token };
  }

  static async login({ email, password }){
    const validationResult = validateUserLogin({ email, password });
    if(validationResult.error) throw new ValidationError(validationResult.error.message);

    const user = await UserRepository.findByEmail({ email });
    if(!user) throw new ValidationError('Credenciales inválidas');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) throw new ValidationError('Credenciales inválidas');

    const token = jwt.sign(
      { id: user._id, email: user.email}, 
      JWT_KEY_SECRET, 
      {  expiresIn: '1h' }
    );

    const { password: _, ...publicUser } = user;
    
    return { user: publicUser, token };
  }
}
