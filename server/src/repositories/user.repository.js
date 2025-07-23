import User from "../models/User.js";

export class UserRepository {
  static async create({ name, username, email, hashedPassword }) {
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
  }

  static async findByEmail({ email }) {
    const user = await User.findOne({ email }).lean();
    return user;
  }

  static async exists({ email }) {
    const userExists = await User.exists({ email });
    return userExists !== null;
  }
}
