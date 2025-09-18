import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const usersRouter = Router();

usersRouter.post('/', UserController.create);
usersRouter.post('/login', UserController.login);
usersRouter.post('/logout', UserController.logout);
usersRouter.patch('/carbon', UserController.createCarbon);
usersRouter.patch('/toggle-favorite-action', UserController.toggleFavoriteAction);

export default usersRouter;