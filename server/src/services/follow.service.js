import User from "../models/User.js";
import { FollowRepository } from "../repositories/follow.repository.js";

export class FollowService {
  static async followUser({ followerId, followingId }) {
    if (followerId === followingId) {
      throw new Error('No puedes seguirte a ti mismo');
    }

    //verificar si existen los ids:
    const [followerExists, followingExists] = await Promise.all([
      User.exists({ _id: followerId }),
      User.exists({ _id: followingId })
    ]);

    if (!followerExists) {
      throw new Error('Usuario seguidor no encontrado');
    }

    if (!followingExists) {
      throw new Error('Usuario a seguir no encontrado');
    }
    
    try {
      const follow = await FollowRepository.followUser({ followerId, followingId });
      return follow;
    } catch (error) {
      throw error;
    }
  }

  static async unfollowUser({ followerId, followingId }) {
    if (followerId === followingId) {
      throw new Error('No puedes seguirte a ti mismo');
    }
    //verificar si existen los ids:
    const [followerExists, followingExists] = await Promise.all([
      User.exists({ _id: followerId }),
      User.exists({ _id: followingId })
    ]);

    if (!followerExists) {
      throw new Error('Usuario seguidor no encontrado');
    }

    if (!followingExists) {
      throw new Error('Usuario a seguir no encontrado');
    }
    
    try {
      const follow = await FollowRepository.unfollowUser({
        followerId,
        followingId
      });

      if (!follow) {
        throw new Error('No se encontró la relación de seguimiento');
      }

      return follow;
    } catch (error) {
      throw error;
    }
  }

  static async getFollowCounts({ userId }) {
    const [followersCount, followingCount] = await Promise.all([
      FollowRepository.countFollowers(userId),
      FollowRepository.countFollowing(userId)
    ]);
    return { followersCount, followingCount };
  }

  static async isFollowing({ followerId, followingId }) {
    const isFollowing = await FollowRepository.isFollowing({ followerId, followingId });
    return !!isFollowing;
  }

  static async getFollowers({ userId, page, limit }) {
    const followers = await FollowRepository.getFollowers({ userId, page, limit });
    return followers;
  }

  static async getFollowing({ userId, page, limit }) {
    const following = await FollowRepository.getFollowing({ userId, page, limit });
    console.log("following", following);
    
    return following;
  }


  
}