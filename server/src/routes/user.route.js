import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { uploadImage } from "../middlewares/upload.middleware.js";

const usersRouter = Router();

usersRouter.post('/', uploadImage, UserController.create);
usersRouter.post('/login', UserController.login);
usersRouter.post('/logout', UserController.logout);
usersRouter.patch('/carbon', UserController.createCarbon);
usersRouter.patch('/toggle-favorite-action', UserController.toggleFavoriteAction);
usersRouter.get('/:userId/favorite-actions/:actionId', UserController.checkFavoriteAction);
usersRouter.get('/:userId/favorite-actions', UserController.getSavedActions);
usersRouter.get('/:userId/achieved-actions', UserController.getAchievedActions);
usersRouter.get('/:userId', UserController.findById);
usersRouter.patch('/add-achieved-action', UserController.addAchievedAction);
usersRouter.get('/:userId/achieved-actions/:actionId', UserController.checkAchievedAction);
usersRouter.get('/:userId/carbon', UserController.checkCarbon);
usersRouter.patch('/set-carbon-goal', UserController.setCarbonGoal);
usersRouter.patch('/:userId', uploadImage, UserController.update);
usersRouter.get('/suggested-users/:userId', UserController.getSuggestedUsers);
usersRouter.delete('/:userId', UserController.deleteAccount);




//update carbon footprint monthly
// Guardar huella (guarda mes actual Y anterior)
usersRouter.post('/:userId/carbon', UserController.saveMonthlyFootprint);

// Obtener todos los meses
usersRouter.get('/:userId/carbon/all', UserController.getAllMonthlyFootprints);

// Obtener por rango de fechas
usersRouter.get('/:userId/carbon/range', UserController.getFootprintsByDateRange);

// Comparar mes actual vs anterior
usersRouter.get('/:userId/carbon/compare', UserController.compareCurrentVsPrevious);
//
export default usersRouter;