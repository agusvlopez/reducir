import { Router } from "express";
import { TokenController } from "../controllers/token.controller.js";

const tokensRouter = Router();

tokensRouter.post('/', TokenController.create);


export default tokensRouter;