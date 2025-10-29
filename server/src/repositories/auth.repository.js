import User from '../models/User.js';

export class AuthRepository {
  static async findUserByGoogleIdOrEmail(googleId, email) {
    return await User.findOne({ 
      $or: [
        { googleId },
        { email }
      ]
    });
  }

  static async createGoogleUser(userData) {
    return await User.create({
      name: userData.name,
      username: userData.username,
      email: userData.email,
      googleId: userData.googleId,
      image: userData.image,
    });
  }

  static async linkGoogleAccount(user, googleId, image) {
    user.googleId = googleId;
    if (!user.image && image) {
      user.image = image;
    }
    return await user.save();
  }
}