import { Router } from "express";
import { PostLikeController } from "../controllers/postLike.controller.js";

const postLikesRouter = Router();

postLikesRouter.post('/', PostLikeController.create);
postLikesRouter.get('/user/:userId', PostLikeController.findByUserId);
postLikesRouter.get('/post/:postId', PostLikeController.findByPostId);
postLikesRouter.delete('/user/:userId/post/:postId', PostLikeController.deleteByPostAndUser);
postLikesRouter.patch('/toggle/post/:postId/user/:userId', PostLikeController.toggleLike);
postLikesRouter.get('/exists/post/:postId/user/:userId', PostLikeController.existsLike);

export default postLikesRouter;