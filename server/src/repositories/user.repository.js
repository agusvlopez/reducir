import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";


export class UserRepository {
  static async create({ name, username, email, hashedPassword, image }) {
    try {
      const user = await User.create({ 
        name,
        username,
        email,
        password: hashedPassword
      });

      return user;      
    } catch (error) {
      return null;
    }
  }

  //TODO: PASAR LOGICA A SERVICE O UN HELPER
  static async update({ userId, name, username, password, email, image }) {
    try {
      // 1. Buscar el usuario actual para obtener la URL de la imagen antigua
      const currentUser = await User.findById(userId).lean();
      if (!currentUser) {
        //TODO:lanzar un error de "no encontrado"
        return null;
      }

      const updateData = {};
      
      if (image) {
        // 2. Si hay una imagen antigua, eliminarla de Cloudinary
        if (currentUser.image) {
          // Extraer el public_id de la URL:
          const publicId = currentUser.image.split('/').pop().split('.')[0];
          const folder = currentUser.image.split('/')[currentUser.image.split('/').length - 2];
          await cloudinary.uploader.destroy(`${folder}/${publicId}`);
        }

        // 3. Subir la nueva imagen
        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: 'users', // Carpeta en Cloudinary
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' } 
          ]
        });
        updateData.image = uploadResult.secure_url;
      }

      if (name) updateData.name = name;
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (password) updateData.password = password;
      
      // 4. Actualizar el usuario en la base de datos
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      const userInfo ={
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image
      }

      return user;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
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
      const userExists = await User.exists({ 
      email, 
      isDeleted: false 
    });
      return userExists !== null;
    } catch (error) {
      return false;
    }
  }

  static async createCarbon({ userId, carbonFootprintYearly, carbonFootprintMonthly }) {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // "2025-11"

      const user = await User.findById(userId);     
      if (!user) return null;
      
      // Calcular la reducción respecto al mes anterior
      let reduction = 0;
      if (user.monthlyFootprints && user.monthlyFootprints.length > 0) {
        // Obtener el último mes registrado
        const lastMonth = user.monthlyFootprints[user.monthlyFootprints.length - 1];
        reduction = lastMonth.value - carbonFootprintMonthly;
      }
      
      // Verificar si ya existe una entrada para el mes actual
      const existingMonthIndex = user.monthlyFootprints.findIndex(
        entry => entry.month === currentMonth
      );
      
      let updatedUser;
      
      if (existingMonthIndex !== -1) {
        // Si ya existe, actualizamos esa entrada
        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              carbonFootprintYearly,
              carbonFootprintMonthly,
              [`monthlyFootprints.${existingMonthIndex}.value`]: carbonFootprintMonthly,
              [`monthlyFootprints.${existingMonthIndex}.reduction`]: reduction
            }
          },
          { new: true, runValidators: true }
        );
      } else {
        // Si no existe, agregamos una nueva entrada
        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              carbonFootprintYearly,
              carbonFootprintMonthly
            },
            $push: {
              monthlyFootprints: {
                month: currentMonth,
                value: carbonFootprintMonthly,
                reduction
              }
            }
          },
          { new: true, runValidators: true }
        );
      }
      
      return updatedUser;

    } catch (error) {
      console.error('Error en createCarbon:', error);
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

  //NUEVO
  //TODO: pasar logica a service, aca solo manejar la conexion con la bbdd

  //este estoy usando:
  static async upsertActionProgress({ userId, actionId, frequency, progress = 0, carbon = 0, newCarbonMonthly }) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      const actionIndex = user.actions_achieved.findIndex(
        action => action.id === actionId || action.id?.toString() === actionId?.toString()
      );

      let updatedUser;
      
      if (actionIndex === -1) {
        // Action not present, add it.
        // The carbon reduction is newCarbonMonthly.
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { 
            $addToSet: { 
              actions_achieved: {
                id: actionId,
                frequency: frequency,
                progress: progress,
                co2ReductionPerAction: carbon,
                co2ReductionTotal: newCarbonMonthly || 0
              }
            },
            $inc: { carbonFootprintMonthly: -(newCarbonMonthly || 0) }
          },
          { new: true, runValidators: true }
        );
      } else {
        // Action is present, update it.
        const oldReduction = user.actions_achieved[actionIndex].co2ReductionTotal || 0;
        const delta = (newCarbonMonthly || 0) - oldReduction;

        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              [`actions_achieved.${actionIndex}.frequency`]: frequency,
              [`actions_achieved.${actionIndex}.progress`]: progress,
              [`actions_achieved.${actionIndex}.co2ReductionTotal`]: newCarbonMonthly || 0,
            },
            $inc: { carbonFootprintMonthly: -delta }
          },
          { new: true, runValidators: true }
        );
      }
      
      return updatedUser;
      
    } catch (error) {
      console.error('Error en upsertActionProgress:', error);
      throw error;
    }
  }

  // ❗❗
  //todo: check if delete
  // ❗❗
  static async addActionToAchieved({ userId, actionAchieved }) {
    try {
      const updatedUser = User.findByIdAndUpdate(
        userId,
        { $addToSet: { actions_achieved: actionAchieved } },
        { new: true, runValidators: true }
      );
      
      return updatedUser;
    } catch (error) {
      console.error('Error', error)
    }
  }

  static async updateActionProgress({ userId, actionId, progress }) {
    try {
      // 1. Primero buscar solo el usuario
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      // 2. Buscar el índice de la acción en el array
      const actionIndex = user.actions_achieved.findIndex(
        action => action.id === actionId || action.id?.toString() === actionId?.toString()
      );
      
      if (actionIndex === -1) {
        throw new Error('Acción no encontrada en actions_achieved');
      }
      
      // 3. Actualizar solo el progress de esa acción específica
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            [`actions_achieved.${actionIndex}.progress`]: progress
          }
        },
        { new: true, runValidators: true }
      );
      
      return updatedUser;
      
    } catch (error) {
      throw error;
    }
  }

  static async checkActionProgress({ userId, actionId }) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
            
      // Asegurar que actionId sea string
      const searchId = String(actionId);
      
      const action = user.actions_achieved.find(a => a.id === searchId);
  
      return action;
    } catch (error) {
      throw error;
    }
  }

  // ❗❗
  //todo: check if delete
  // ❗❗
  static async addAchievedAction({ userId, actionId, carbon, newCarbonMonthly, frequency }) {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      const user = await User.findById(userId);
      if (!user) return null;
      
      // Buscar el índice del mes actual en monthlyFootprints
      const currentMonthIndex = user.monthlyFootprints.findIndex(
        entry => entry.month === currentMonth
      );
      
      const actionAchieved = {
        id: actionId,
        frequency: frequency,
        co2ReductionPerAction: carbon
      }

      let updateQuery = {
        $addToSet: { actions_achieved: actionAchieved },
        $set: { carbonFootprintMonthly: newCarbonMonthly }
      };
      
      // Si existe el mes actual, actualizar su value
      if (currentMonthIndex !== -1) {
        updateQuery.$set[`monthlyFootprints.${currentMonthIndex}.value`] = newCarbonMonthly;
      }
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateQuery,
        { new: true, runValidators: true }
      );
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  static async removeFromSavedActions({ userId, actionId }) {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { $pull: { actions_saved: actionId } },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  static async updateGoalStatus({ userId, status, completedAt = null }) {
    try {
      const updateData = { 'carbonGoal.status': status };
      if (completedAt) {
        updateData['carbonGoal.completedAt'] = completedAt;
      }
      
      return await User.updateOne({ _id: userId }, { $set: updateData });
    } catch (error) {
      throw error;
    }
  }

  static async checkAchievedAction({ userId, actionId }) {
    try {
      const result = await User.findById(userId, 'actions_achieved').lean();
      const achievedActions = result?.actions_achieved;

      if (!achievedActions || achievedActions.length === 0) return false;
      
      // Buscar si existe un objeto con el id que coincida
      return achievedActions?.some(action => action.id === actionId || action.id?.toString() === actionId?.toString());
      
    } catch (error) {
      console.error('Error en checkAchievedAction:', error);
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
      console.log("result getAchievedActions",result );
      
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

  static async getRandomUsers({ excludeIds = [], limit = 5 }) {
    return await User.aggregate([
      // Excluir usuarios específicos
      { $match: { _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      // Ordenar aleatoriamente
      { $sample: { size: limit } },
      // Seleccionar solo los campos necesarios
      { 
        $project: { 
          _id: 1,
          name: 1, 
          username: 1, 
          image: 1,
          carbon: 1
        } 
      }
    ]);
  }

  static async deleteAccount({ userId }) {
    try {
      //hacer soft delete de user y de todos sus respectivos datos
      const user = await User.findByIdAndUpdate(
        userId,
        { isDeleted: true },
        { new: true, runValidators: true }
      );

      return user;
    
    } catch (error) {
      return null;
    }
  }
}
