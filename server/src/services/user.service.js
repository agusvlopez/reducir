import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from "../repositories/user.repository.js";
import { NotFoundError } from '../errors/NotFoundError.js';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, SALT_ROUNDS } from "../config.js";
import { validateUserCreate, validateUserLogin } from "../validations/user.schema.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ConflictError } from "../errors/ConflictError.js";
import { TokenService } from './token.service.js';
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
  static async addAchievedAction(userId, actionId, carbonReduction) {
    try {
      // Validaciones
      if (!userId || !actionId) {
        throw new Error('userId y actionId son requeridos');
      }
      
      if (carbonReduction === undefined || carbonReduction < 0) {
        throw new Error('La reducción de carbono debe ser un número válido positivo');
      }
      
      // Obtener usuario actual
      const user = await UserRepository.findById({ id: userId });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      // Calcular nuevo valor sin que sea negativo
      const newCarbonMonthly = Math.max(0, user.carbonFootprintMonthly - carbonReduction);
      
      // Agregar acción lograda y actualizar carbono
      let updatedUser = await UserRepository.addAchievedAction({
        userId,
        actionId,
        newCarbonMonthly
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
        carbonReduced: carbonReduction,
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





  //update carbon 
  static calculateMonthlyFootprint(carbonFootprintYearly) {
    return carbonFootprintYearly / 12;
  }

  static getCurrentMonth() {
    return new Date().toISOString().slice(0, 7);
  }

  static getPreviousMonth() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return lastMonth.toISOString().slice(0, 7);
  }

  static calculateReduction(currentValue, previousValue) {
    if (!previousValue) return 0;
    return previousValue - currentValue;
  }

  static addOrUpdateMonth(monthlyFootprints, month, value) {
    const existingIndex = monthlyFootprints.findIndex(
      entry => entry.month === month
    );
    
    if (existingIndex !== -1) {
      // Actualizar registro existente
      monthlyFootprints[existingIndex].value = value;
      return { status: 'updated', footprints: monthlyFootprints };
    }
    
    // Calcular reducción respecto al mes inmediatamente anterior
    let reduction = 0;
    
    const sortedFootprints = [...monthlyFootprints].sort((a, b) => 
      b.month.localeCompare(a.month)
    );
    
    const previousRecord = sortedFootprints.find(entry => entry.month < month);
    
    if (previousRecord) {
      reduction = this.calculateReduction(value, previousRecord.value);
    }
    
    // Agregar nuevo registro
    monthlyFootprints.push({
      month: month,
      value: value,
      reduction: reduction
    });
    
    return { status: 'created', footprints: monthlyFootprints };
  }

  sortFootprintsByDate(footprints, ascending = true) {
    return [...footprints].sort((a, b) => {
      return ascending 
        ? a.month.localeCompare(b.month)
        : b.month.localeCompare(a.month);
    });
  }

  static async saveMonthlyFootprint(userId, carbonFootprintYearly) {
    const user = await carbonRepository.findUserById(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const carbonFootprintMonthly = this.calculateMonthlyFootprint(carbonFootprintYearly);
    const currentMonth = this.getCurrentMonth();
    const previousMonth = this.getPreviousMonth();

    // Guardar MES ANTERIOR
    const previousResult = this.addOrUpdateMonth(
      user.monthlyFootprints, 
      previousMonth, 
      carbonFootprintMonthly
    );
    const previousStatus = previousResult.status;
    user.monthlyFootprints = previousResult.footprints;

    // Guardar MES ACTUAL
    const currentResult = this.addOrUpdateMonth(
      user.monthlyFootprints, 
      currentMonth, 
      carbonFootprintMonthly
    );
    const currentStatus = currentResult.status;
    user.monthlyFootprints = currentResult.footprints;

    // Actualizar valores generales
    user.carbonFootprintYearly = carbonFootprintYearly;
    user.carbonFootprintMonthly = carbonFootprintMonthly;

    // Ordenar por fecha
    user.monthlyFootprints = this.sortFootprintsByDate(user.monthlyFootprints, true);

    await carbonRepository.saveUser(user);

    return {
      carbonFootprintYearly,
      carbonFootprintMonthly,
      savedMonths: {
        previous: {
          month: previousMonth,
          status: previousStatus
        },
        current: {
          month: currentMonth,
          status: currentStatus
        }
      },
      totalMonthsRecorded: user.monthlyFootprints.length,
      monthlyFootprints: user.monthlyFootprints
    };
  }

  static async getAllMonthlyFootprints(userId) {
    const user = await carbonRepository.getMonthlyFootprints(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const sortedFootprints = this.sortFootprintsByDate(user.monthlyFootprints, false);

    return {
      totalMonths: sortedFootprints.length,
      monthlyFootprints: sortedFootprints,
      currentFootprint: user.carbonFootprintMonthly,
      yearlyFootprint: user.carbonFootprintYearly
    };
  }

  static async getFootprintsByDateRange(userId, startMonth, endMonth) {
    const user = await carbonRepository.findUserById(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    let filteredFootprints = user.monthlyFootprints;

    if (startMonth) {
      filteredFootprints = filteredFootprints.filter(entry => entry.month >= startMonth);
    }

    if (endMonth) {
      filteredFootprints = filteredFootprints.filter(entry => entry.month <= endMonth);
    }

    filteredFootprints = this.sortFootprintsByDate(filteredFootprints, true);

    const total = filteredFootprints.reduce((sum, entry) => sum + entry.value, 0);
    const average = filteredFootprints.length > 0 ? total / filteredFootprints.length : 0;
    const totalReduction = filteredFootprints.reduce((sum, entry) => sum + (entry.reduction || 0), 0);

    return {
      range: { startMonth, endMonth },
      monthsCount: filteredFootprints.length,
      total,
      average,
      totalReduction,
      monthlyFootprints: filteredFootprints
    };
  }

  static async compareCurrentVsPrevious(userId) {
    const user = await carbonRepository.findUserById(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const currentMonth = this.getCurrentMonth();
    const previousMonth = this.getPreviousMonth();

    const current = user.monthlyFootprints.find(entry => entry.month === currentMonth);
    const previous = user.monthlyFootprints.find(entry => entry.month === previousMonth);

    if (!current || !previous) {
      return null;
    }

    const difference = previous.value - current.value;
    const percentageChange = (difference / previous.value) * 100;

    return {
      current: {
        month: currentMonth,
        value: current.value
      },
      previous: {
        month: previousMonth,
        value: previous.value
      },
      difference: difference,
      percentageChange: percentageChange.toFixed(2),
      trend: difference > 0 ? 'mejora' : difference < 0 ? 'aumento' : 'igual'
    };
  }
  //
}
