import { Router } from "express";
import { PostCommentLikeController } from "../controllers/postCommentLike.controller.js";


const postCommentLikesRouter = Router();

// Dar/quitar like
postCommentLikesRouter.post('/:commentId/like', PostCommentLikeController.toggleLike);

// Verificar si el user dio like y cantidad total de likes del post
postCommentLikesRouter.get('/:commentId/like/status', PostCommentLikeController.getLikeStatus);


export default postCommentLikesRouter;