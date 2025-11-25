import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/user.repository.js";
import { NotFoundError } from '../errors/NotFoundError.js';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, SALT_ROUNDS } from "../config.js";
import { validateUserCreate, validateUserLogin } from "../validations/user.schema.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ConflictError } from "../errors/ConflictError.js";
import { TokenService } from './token.service.js';
import { frequencyToChecks } from '../constants/frequencyActions.js';
import { FollowRepository } from '../repositories/follow.repository.js';
import User from '../models/User.js';

export class UserService {
  static async create({ name, username, email, password }){

    const validationResult = validateUserCreate({ name, username, email, password });
    if (validationResult.error) throw new ValidationError(validationResult.error.message);

    //TODO: manejar las validaciones de email unico de otra forma
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

  static async update({ userId, name, username, password, email, image }){

    if (password) {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      password = hashedPassword;
    }

    const userUpdated = UserRepository.update({ userId, name, username, password, email, image });
    return userUpdated;  
  }

  static async login({ email, password }){
    const validationResult = validateUserLogin({ email, password });
    if(validationResult.error) throw new ValidationError(validationResult.error.message);

    const user = await UserRepository.findByEmail({ email });
    if(!user || user.isDeleted) throw new ValidationError('Credenciales inválidas');

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

  static async createCarbon({ userId, carbonFootprintYearly, carbonFootprintMonthly }){
    const updatedUser = await UserRepository.createCarbon({ userId, carbonFootprintYearly, carbonFootprintMonthly });
    return updatedUser;
  }

  static async toggleFavoriteAction({ userId, actionId }){
    const updatedUser = await UserRepository.toggleFavoriteAction({ userId, actionId });
    return updatedUser;
  } 

  static async findById({ id }) {
    const user = await UserRepository.findById({ id });
    if (!user || user.isDeleted) throw new NotFoundError('Usuario no encontrado');
    return user;
  }

  static async checkFavoriteAction({ userId, actionId }){
    const isFavorite = await UserRepository.checkFavoriteAction({ userId, actionId });
    return isFavorite;
  }

  static async getSavedActions(userId) {
    const favoriteActions = await UserRepository.getSavedActions(userId);
    return favoriteActions;
  }

  //NUEVO:
  static async upsertActionProgress({ userId, actionId, frequency, progress = 0, carbon = 0 }) {
    if (!frequencyToChecks[frequency]) {
      throw new ValidationError('Frecuencia inválida.');
    }

    if (progress < 0) {
      progress = 0;
    }
    
    const newCarbonMonthly = (carbon / 100) * progress;

    const updatedUser = await UserRepository.upsertActionProgress({ 
        userId, 
        actionId, 
        frequency, 
        progress, 
        carbon, 
        newCarbonMonthly 
    });

    return updatedUser;
  }

  static async checkActionProgress({ userId, actionId }) {
    try {
      const actionProgress = await UserRepository.checkActionProgress({ userId, actionId });
      return actionProgress;
    } catch (error) {
      throw error;
    }
  }

    static async addActionToAchieved({ userId, actionId, carbon, frequency}) {
      //push action to achieved_actions
      const actionAchieved = {
        id: actionId,
        frequency: frequency,
        co2ReductionPerAction: carbon
      }
      
      const updatedUser = await UserRepository.addActionToAchieved({ userId, actionAchieved });
      return updatedUser;
    }

    static async updateActionProgress(userId, actionId, progress) {
      try {
        // Validaciones
        if (!userId || !actionId) {
          throw new Error('userId y actionId son requeridos');
        }
        
        if (typeof progress !== 'number' || progress < 0 || progress > 100) {
          throw new Error('El progreso debe ser un número entre 0 y 100');
        }
        
        const updatedUser = await UserRepository.updateActionProgress({
          userId,
          actionId,
          progress
        });
        
        if (!updatedUser) {
          throw new Error('Error al actualizar el progreso');
        }
        
        // Buscar la acción actualizada para devolver sus detalles
        const updatedAction = updatedUser.actions_achieved.find(
          action => action.id === actionId || action.id?.toString() === actionId?.toString()
        );
        
        return {
          success: true,
          action: updatedAction,
          progress
        };
        
      } catch (error) {
        throw error;
      }
    }

  static async addAchievedAction(userId, actionId, carbon, frequency) {
    try {
      // Validaciones
      if (!userId || !actionId) {
        throw new Error('userId y actionId son requeridos');
      }
      
      if (carbon === undefined || carbon < 0) {
        throw new Error('La reducción de carbono debe ser un número válido positivo');
      }
      
      // Obtener usuario actual
      const user = await UserRepository.findById({ id: userId });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar si ya logró esta acción
      const isAlreadyAchieved = user.actions_achieved.some(
        action => action.id?.toString() === actionId.toString()
      );
      
      if (isAlreadyAchieved) {
        throw new Error('Ya completaste esta acción anteriormente');
      }
      
      // Calcular nuevo valor sin que sea negativo
      const newCarbonMonthly = Math.max(0, user.carbonFootprintMonthly - carbon);
      
      // Agregar acción lograda y actualizar carbono
      let updatedUser = await UserRepository.addAchievedAction({
        userId,
        actionId,
        carbon,
        newCarbonMonthly,
        frequency
      });
      
      if (!updatedUser) {
        throw new Error('Error al actualizar el usuario');
      }
      
      // Si la acción está en actions_saved, eliminarla
      if (updatedUser.actions_saved.includes(actionId)) {
        updatedUser = await UserRepository.removeFromSavedActions({ userId, actionId });
      }
      
      // Verificar si cumplió el objetivo
      const goalAchievement = await this.checkGoalAchievement(updatedUser);
      
      return {
        user: updatedUser,
        goalAchievement,
        carbonReduced: carbon,
        newCarbonFootprint: newCarbonMonthly
      };
      
    } catch (error) {
      throw error;
    }
  }

  static async checkGoalAchievement(user) {
    try {
      if (!user.carbonGoal || user.carbonGoal.status !== 'active') {
        return null;
      }
      
      const goal = user.carbonGoal;
      const currentCarbon = user.carbonFootprintMonthly;
      
      // Verificar si alcanzó o superó la meta
      if (currentCarbon <= goal.targetValue) {
        // Marcar la meta como completada
        await UserRepository.updateGoalStatus({
          userId: user._id,
          status: 'completed',
          completedAt: new Date()
        });
        
        return {
          achieved: true,
          message: '¡Felicitaciones! Has alcanzado tu meta de reducción de carbono',
          goal: {
            targetReduction: goal.targetReductionPercentage,
            targetValue: goal.targetValue,
            achievedValue: currentCarbon,
            exceededBy: Math.max(0, goal.targetValue - currentCarbon)
          }
        };
      }
      
      // Calcular progreso actual
      const totalReduction = goal.baselineValue - goal.targetValue;
      const currentReduction = goal.baselineValue - currentCarbon;
      const progress = Math.min(100, Math.max(0, Math.round((currentReduction / totalReduction) * 100)));
      const remaining = Math.max(0, currentCarbon - goal.targetValue);
      
      return {
        achieved: false,
        progress,
        remaining,
        message: `Vas por buen camino. Te faltan ${remaining.toFixed(1)} kg de reducción para tu meta`
      };
      
    } catch (error) {
      throw error;
    }
  }
  //


  static async checkAchievedAction({ userId, actionId }){
    const isAchieved = await UserRepository.checkAchievedAction({ userId, actionId });
    return isAchieved;
  }

  static async checkCarbon({ userId }){
    const carbon = await UserRepository.checkCarbon({ userId });
    return carbon;
  }

  static async getAchievedActions(userId) {
    const achievedActions = await UserRepository.getAchievedActions(userId);
    return achievedActions;
  }

  static async setCarbonGoal({ userId, reductionPercentage }){
    const user = await UserRepository.findById({ id: userId });
    if (!user) throw new Error('Usuario no encontrado');
    
    const currentYear = new Date().getFullYear();
    let baselineValue;
    let startDate = new Date();

    if (user.carbonGoal && user.carbonGoal.status === 'active') {
      const existingGoal = user.carbonGoal;
      
      if (existingGoal.year === currentYear) {
        baselineValue = existingGoal.baselineValue;
        startDate = existingGoal.startDate;
      } else {
        baselineValue = user.carbonFootprintYearly;
      }
    } else {
      baselineValue = user.carbonFootprintYearly;
    }

    const targetValue = Math.round(baselineValue * (1 - reductionPercentage / 100));
    
    const newGoal = {
      year: currentYear,
      targetReductionPercentage: reductionPercentage,
      baselineValue, 
      targetValue,
      startDate, 
      status: 'active'
    };

    const updatedUser = await UserRepository.setCarbonGoal({ userId, carbonGoal: newGoal });
    return updatedUser;
  }

  static async getSuggestedUsers({ userId, limit = 5 }) {
    const followingIds = await FollowRepository.getFollowingIds(userId);
    const usersDeleted = await User.find({ isDeleted: true });
    const usersDeletedIds = usersDeleted.map(user => user._id.toString());

    const suggestions = await UserRepository.getRandomUsers({
      excludeIds: [userId, ...followingIds, ...usersDeletedIds],
      limit
    });
    
    return suggestions;
  }

  static async deleteAccount({ userId }) {
    const user = await UserRepository.deleteAccount({ userId });
    if (!user) throw new NotFoundError('Usuario no encontrado');
    return user;
  }

}
