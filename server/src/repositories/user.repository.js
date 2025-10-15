import User from "../models/User.js";

export class UserRepository {
  static async create({ name, username, email, hashedPassword }) {
    try {
      const user = await User.create({ 
        name,
        username,
        email,
        password: hashedPassword,
      });

      return user;      
    } catch (error) {
      return null;
    }
  }

  static async findByEmail({ email }) {
    try {
      const user = await User.findOne({ email }).lean();
      return user;
    } catch (error) {
      return null;
    }
  }

  static async findById({ id }) {
    try {
      const user = await User.findById(id)
        .lean();
      return user;
    } catch (error) {
      return null;
    }
  }

  static async exists({ email }) {
    try {
      const userExists = await User.exists({ email });
      return userExists !== null;
    } catch (error) {
      return false;
    }
  }

  static async createCarbon({ userId, carbon }) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { carbon } },
        { new: true, runValidators: true }
      );
      return updatedUser;

    } catch (error) {
      return null;
    }
  }
  //TODO: pasar logica a service, aca solo manejar la conexion con la bbdd
  static async toggleFavoriteAction({ userId, actionId }) {
    try {
      // First check if the action is already in favorites
      const user = await User.findById(userId);
      
      if (!user) {
          throw new Error(`User with ID ${userId} not found`);
      }
      
      const isInFavorites = user?.actions_saved?.includes(actionId);
      
      let updatedUser;
      if (isInFavorites) {
          // Remove from favorites
          updatedUser = await User.findByIdAndUpdate(
              userId,
              { $pull: { actions_saved: actionId } },
              { new: true, runValidators: true }
          );
      } else {
          // Add to favorites
          updatedUser = await User.findByIdAndUpdate(
              userId,
              { $addToSet: { actions_saved: actionId } },
              { new: true, runValidators: true }
          );
      }
      
      const { password, __v, ...userWithoutPassword } = updatedUser.toObject();

      return {
        success: true,
        isAdded: !isInFavorites,
        message: !isInFavorites ? 'Action added to favorites' : 'Action removed from favorites',
        user: userWithoutPassword
      };
        
    } catch (error) {
        throw new Error(`Failed to toggle favorite action: ${error.message}`);
    }
  }

  static async checkFavoriteAction({ userId, actionId }) {
    try {
      const result = await User.findById(userId, 'actions_saved').lean();
      const favorites = result?.actions_saved;

      if (!favorites) return false;
      return favorites.includes(actionId);
    } catch (error) {
      return false;
    }
  }

  static async getSavedActions(userId) {
    try {
      const result = await User.findById(userId, 'actions_saved').lean();
      return result?.actions_saved || [];
    } catch (error) {
      return [];
    }
  }

  //TODO: pasar logica a service, aca solo manejar la conexion con la bbdd
  static async addAchievedAction({ userId, actionId, carbon }) {
    try {
      // Agregar logro a actions_achieved y reducir el carbon
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
          $addToSet: { actions_achieved: actionId }, 
          $inc: { carbon: -carbon } 
        },
        { new: true, runValidators: true }
      );

      // Si la accion esta en actions_saved eliminarla
      if (updatedUser.actions_saved.includes(actionId)) {
        updatedUser.actions_saved = updatedUser.actions_saved.filter(id => id !== actionId);
        await updatedUser.save();
      }

      // NUEVO: Verificar si cumplió el objetivo
      let goalAchievement = null;
      
      if (updatedUser.carbonGoal && updatedUser.carbonGoal.status === 'active') {
        const goal = updatedUser.carbonGoal;
        const currentCarbon = updatedUser.carbon;
        
        // Verificar si alcanzó o superó la meta
        if (currentCarbon <= goal.targetValue) {
          // Marcar la meta como completada
          await User.updateOne(
            { _id: userId },
            { 
              $set: { 
                'carbonGoal.status': 'completed',
                'carbonGoal.completedAt': new Date()
              } 
            }
          );
          
          goalAchievement = {
            achieved: true,
            message: '¡Felicitaciones! Has alcanzado tu meta de reducción de carbono',
            goal: {
              targetReduction: goal.targetReductionPercentage,
              targetValue: goal.targetValue,
              achievedValue: currentCarbon,
              exceededBy: goal.targetValue - currentCarbon
            }
          };
        } else {
          // Calcular progreso actual
          const totalReduction = goal.baselineValue - goal.targetValue;
          const currentReduction = goal.baselineValue - currentCarbon;
          const progress = Math.round((currentReduction / totalReduction) * 100);
          
          goalAchievement = {
            achieved: false,
            progress: progress,
            remaining: currentCarbon - goal.targetValue,
            message: `Vas por buen camino. Te faltan ${Math.round(currentCarbon - goal.targetValue)} unidades para tu meta`
          };
        }
      }

      return {
        user: updatedUser,
        goalAchievement
      };
    } catch (error) {
      console.error('Error en addAchievedAction:', error);
      return null;
    }
  }

  static async checkAchievedAction({ userId, actionId }) {
    try {
      const result = await User.findById(userId, 'actions_achieved').lean();
      const achievedActions = result?.actions_achieved;

      if (!achievedActions) return false;
      return achievedActions.includes(actionId);
    } catch (error) {
      return false;
    }
  }

  static async checkCarbon({ userId }) {
    try {
      const result = await User.findById(userId, 'carbon').lean();
      return result?.carbon || 0;
    } catch (error) {
      return 0;
    }
  }

  static async getAchievedActions(userId) {
    try {
      const result = await User.findById(userId, 'actions_achieved').lean();
      //ahora buscar 
      return result?.actions_achieved || [];
     
    } catch (error) {
      return [];
    }
  }

  static async setCarbonGoal({ userId, carbonGoal }) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { carbonGoal },
        { new: true, runValidators: true }
      );
      return updatedUser;
    } catch (error) {
      return null;
    }
  }

}
