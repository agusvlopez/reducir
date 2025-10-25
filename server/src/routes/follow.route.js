import { Router } from "express";
import { FollowController } from "../controllers/follow.controller.js";

const followRouter = Router();

followRouter.post('/', FollowController.followUser);
followRouter.delete('/', FollowController.unfollowUser);
followRouter.get('/counts/:userId', FollowController.getFollowCounts);
followRouter.get('/is-following/:followerId/:followingId', FollowController.isFollowing);
followRouter.get('/followers/:userId', FollowController.getFollowers);
followRouter.get('/following/:userId', FollowController.getFollowing);


export default followRouter;