import Follow from "../models/Follow.js";

export class FollowRepository {
  //todo: manejar con errors classes
  static async followUser({ followerId, followingId }) {
    try {
      // Crear la relación de seguimiento
      const follow = await Follow.create({
        follower: followerId,
        following: followingId
      });
      return follow;
    } catch (error) {
      console.log("error", error);
      
      if (error.code === 11000) {
        throw new Error('Ya sigues a este usuario');
      }
      throw error;
    }
  }

  //todo: manejar con errors classes
  static async unfollowUser({ followerId, followingId }) {
    try {
      // Eliminar la relación de seguimiento
      const follow = await Follow.findOneAndDelete({
        follower: followerId,
        following: followingId
      });
      return follow;
    } catch (error) {
      console.log("error unfollowUser", error);
      
      throw error;
    }
  }

  static async countFollowers(userId) {
    return await Follow.countDocuments({ following: userId });
  }
  
  static async countFollowing(userId) {
    return await Follow.countDocuments({ follower: userId });
  }
  
  static async isFollowing({ followerId, followingId }) {
    return await Follow.exists({ follower: followerId, following: followingId });
  }
  
  static async getFollowers({ userId, page = 1, limit = 20 }) {
    return await Follow.find({ following: userId })
      .populate('follower', 'name username profilePicture')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  static async getFollowingIds(userId) {
    console.log("userId in follow repository", userId);
    
    const following = await Follow.find({ follower: userId })
      .select('following -_id')
      .lean();
      
    return following.map(f => f.following.toString());

  }

}