import { FollowService } from "../services/follow.service.js";

export class FollowController {
  static async followUser(req, res) {
    const { followerId, followingId } = req.body;

    try {
      const follow = await FollowService.followUser({ followerId, followingId });
      res.status(201).json(follow);
    } catch (error) {
      //todo: manejar con errors classes
      if (error.message === 'No puedes seguirte a ti mismo' || error.message === 'Ya sigues a este usuario') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Usuario seguidor no encontrado' || error.message === 'Usuario a seguir no encontrado') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ message: 'Error al seguir al usuario' });
    }
  }

  static async unfollowUser(req, res) {
    const { followerId, followingId } = req.body;

    try {
      const follow = await FollowService.unfollowUser({ followerId, followingId });

      res.status(200).json(follow);
    } catch (error) {
      console.log("error", error);
    
      //todo: manejar con errors classes
      if(error.message === "Usuario seguidor no encontrado" || error.message === "Usuario a seguir no encontrado" || error.message === "No se encontró la relación de seguimiento") {
        return res.status(404).json({ error: error.message });
      }
      if(error.message === "No puedes seguirte a ti mismo") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ message: 'Error al dejar de seguir al usuario' });
    }
  } 

  static async getFollowCounts(req, res) {
    const { userId } = req.params;

    try {
      const counts = await FollowService.getFollowCounts({ userId });
      res.status(200).json(counts);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los conteos de seguidores y siguiendo' });
    }
  }

  static async isFollowing(req, res) {
    const { followerId, followingId } = req.params;

    try {
      const isFollowing = await FollowService.isFollowing({ followerId, followingId });
      
      res.status(200).json(isFollowing);
    } catch (error) {
      res.status(500).json({ message: 'Error al verificar si el usuario está siguiendo' });
    }
  }

  static async getFollowers(req, res) {
    const { userId } = req.params;
    const { page, limit } = req.query;

    try {
      const followers = await FollowService.getFollowers({ userId, page, limit });
      res.status(200).json(followers);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los seguidores' });
    }
  }

  static async getFollowing(req, res) {
    const { userId } = req.params;
    const { page, limit } = req.query;

    try {
      const following = await FollowService.getFollowing({ userId, page, limit });
      res.status(200).json(following);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios que el usuario sigue' });
    }
  }


}