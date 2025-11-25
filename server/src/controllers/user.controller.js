import { ConflictError } from "../errors/ConflictError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
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
          maxAge: 7 * 24 * 60 * 60 * 1000
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

  static async update(req, res) {
    const { userId } = req.params;
    const { name, username, password, email } = req.body;    
    
    let imageBase64 = null;
    if (req.file) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    try {
      const updatedUser = await UserService.update({ userId, name, username, password, email, image: imageBase64 });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).send(error.message);
      }
      return res.status(500).json({ message: 'Ocurrió un error inesperado en el servidor.' });
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
    const { userId, carbonFootprintYearly, carbonFootprintMonthly } = req.body;
    
    try {
      const updatedUser = await UserService.createCarbon({ userId, carbonFootprintYearly, carbonFootprintMonthly });
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

  //NUEVO:
  //este estoy usando:
  static async upsertActionProgress(req, res) {
    try {
      const { userId, actionId, frequency, progress = 0, carbon = 0, newCarbonMonthly } = req.body;
      
      const result = await UserService.upsertActionProgress({ userId, actionId, frequency, progress, carbon, newCarbonMonthly });  
      
      return res.status(200).json({
        success: true,
        message: 'Progreso actualizado o creado correctamente',
        data: result
      });
    }
    catch (error) {
      console.error('Error al actualizar progreso:', error);
      return res.status(500).json({ message: 'Error al actualizar progreso' });
    }
  }

  static async checkActionProgress(req, res) {
    try {
      const { userId, actionId } = req.params;
      
      const result = await UserService.checkActionProgress({ userId, actionId });
      
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: 'Progress not found for this action.' });
      }
    } catch (error) {
      console.error('Error al verificar progreso:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }


  static async addActionToAchieved(req, res) {
    try {
      const { userId, actionId, carbon, frequency } = req.body;
      
      const result = await UserService.addActionToAchieved({ userId, actionId, carbon, frequency });
      
      return result.status(200).json({
        success: true,
        message: 'Acción lograda agregada correctamente',
        data: result
      });
      
    } catch (error) {
      console.error('Error al agregar acción lograda:', error);
    }
  }
  
  static async updateActionProgress(req, res) {
    try {
      const { userId, actionId } = req.params;
      const { progress } = req.body;
      console.log(" userId, actionId ",  userId, actionId );
      console.log("progress", progress);
      
      const result = await UserService.updateActionProgress(userId, actionId, progress);
      
      return res.status(200).json({
        success: true,
        message: 'Progreso actualizado correctamente',
        data: result
      });
      
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
      
      const statusCode = error.message.includes('no encontrada') ? 404 : 400;
      
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al actualizar el progreso'
      });
    }
  }

  static async addAchievedAction(req, res) {
    try {      
      const { userId, actionId, carbon, frequency } = req.body;
      
      const result = await UserService.addAchievedAction(userId, actionId, carbon, frequency);
      
      return res.status(200).json({
        success: true,
        message: 'Acción lograda agregada correctamente',
        data: {
          user: {
            carbonFootprintMonthly: result.user.carbonFootprintMonthly,
            carbonFootprintYearly: result.user.carbonFootprintYearly,
            monthlyFootprints: result.user.monthlyFootprints,
            actions_achieved: result.user.actions_achieved,
            actions_saved: result.user.actions_saved
          },
          carbonReduced: result.carbonReduced,
          newCarbonFootprint: result.newCarbonFootprint,
          goalAchievement: result.goalAchievement
        }
      });
      
    } catch (error) {
      console.error('Error al agregar acción lograda:', error);
      
      const statusCode = error.message === 'Usuario no encontrado' ? 404 : 400;
      
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al agregar la acción lograda'
      });
    }
  }
  //

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

  static async getAchievedActions(req, res) {
    const { userId } = req.params;

    try {
      const achievedActions = await UserService.getAchievedActions(userId);
      res.status(200).json(achievedActions);
    }catch(error){
      if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async setCarbonGoal(req, res) {
    const { userId, reductionPercentage } = req.body;

    try {
      const updatedUser = await UserService.setCarbonGoal({ userId, reductionPercentage });
      res.status(200).json(updatedUser);
    } catch (error) {
      if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }

  static async getSuggestedUsers(req, res) {
    try {      
      const { userId } = req.params;
      
      const { limit = 5 } = req.query;

      const suggestions = await UserService.getSuggestedUsers({ 
        userId, 
        limit: parseInt(limit) 
      });
      
      res.status(200).json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }  

  static async deleteAccount(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserService.deleteAccount({ userId });
      res.status(200).json(user);
    } catch (error) {
      if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Error inesperado' });
    }
  }
}