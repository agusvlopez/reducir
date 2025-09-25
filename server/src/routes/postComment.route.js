import { Router } from "express";
import { PostCommentController } from "../controllers/postComment.controller.js";


const postCommentsRouter = Router();

postCommentsRouter.post('/', PostCommentController.create);
postCommentsRouter.delete('/:id', PostCommentController.delete);
postCommentsRouter.get('/:id', PostCommentController.findById);
postCommentsRouter.get('/post/:postId', PostCommentController.findByPostId);


export default postCommentsRouter;