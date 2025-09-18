import User from "../models/User.js";

export class UserRepository {
  static async create({ name, username, email, hashedPassword }) {
    try {
      const user = await User.create({ 
        name,
        username,
        email,
        password: hashedPassword,
        image: null,
        carbon: 0,
        achievements: [],
        actions: [],
        followers: [],
        following: [],
      });

      return user;      
    } catch (error) {
      return null;
    }
  }

  static async findByEmail({ email }) {
    try {
      const user = await User.findOne({ email }).lean();
      //todo: pasar user menos la pass
      return user;
    } catch (error) {
      return null;
    }
  }

  static async exists({ email }) {
    try {
      const userExists = await User.exists({ email });
      return userExists !== null;
    } catch (error) {
      return false;
    }
  }

  static async createCarbon({ userId, carbon }) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { carbon } },
        { new: true, runValidators: true }
      );
      return updatedUser;

    } catch (error) {
      return null;
    }
  }

  static async toggleFavoriteAction({ userId, actionId }) {
    try {
      // First check if the action is already in favorites
      const user = await User.findById(userId);
      
      if (!user) {
          throw new Error(`User with ID ${userId} not found`);
      }
      
      const isInFavorites = user.favorites.includes(actionId);
      
      let updatedUser;
      if (isInFavorites) {
          // Remove from favorites
          updatedUser = await User.findByIdAndUpdate(
              userId,
              { $pull: { favorites: actionId } },
              { new: true, runValidators: true }
          );
      } else {
          // Add to favorites
          updatedUser = await User.findByIdAndUpdate(
              userId,
              { $addToSet: { favorites: actionId } },
              { new: true, runValidators: true }
          );
      }
      
      return {
        success: true,
        isAdded: !isInFavorites,
        message: !isInFavorites ? 'Action added to favorites' : 'Action removed from favorites',
        //pasar todo user menos el password
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          image: updatedUser.image,
          carbon: updatedUser.carbon,
          achievements: updatedUser.achievements,
          actions: updatedUser.actions,
          followers: updatedUser.followers,
          following: updatedUser.following,
          favorites: updatedUser.favorites
        }

      };
        
    } catch (error) {
        throw new Error(`Failed to toggle favorite action: ${error.message}`);
    }
  }
}
