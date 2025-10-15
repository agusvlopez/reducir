import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const usersRouter = Router();

usersRouter.post('/', UserController.create);
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

export default usersRouter;