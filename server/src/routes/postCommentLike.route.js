import { Router } from "express";
import { PostCommentLikeController } from "../controllers/postCommentLike.controller.js";


const postCommentLikesRouter = Router();

postCommentLikesRouter.post('/', PostCommentLikeController.toggleLike);
postCommentLikesRouter.get('/exists/comment/:commentId/user/:userId', PostCommentLikeController.existsLike);


export default postCommentLikesRouter;