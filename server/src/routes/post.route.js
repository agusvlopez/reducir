import { Router } from "express";
import { PostController } from "../controllers/post.controller.js";
import { uploadImage } from "../middlewares/upload.middleware.js";

const postsRouter = Router();

postsRouter.post('/', uploadImage, PostController.create);
postsRouter.get('/:postId', PostController.findById);
postsRouter.get('/user/:userId', PostController.findByUserId);
postsRouter.get('/', PostController.findAll);
postsRouter.delete('/:postId', PostController.deleteById);
postsRouter.patch('/:postId/likes', PostController.incrementLikesCount);
postsRouter.patch('/:postId/likes/decrement', PostController.decrementLikesCount);

export default postsRouter;