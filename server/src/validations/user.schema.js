import { z } from 'zod';

/**
 * Schema for validating the input when creating a new user.
 * This only includes the fields a user should provide.
 */
export const createUserSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }).min(1, { message: 'Name cannot be empty' }),
  username: z.string({
    required_error: 'Username is required',
  }).min(1, { message: 'Username cannot be empty' }),
  email: z.email({ message: 'Invalid email address' }),
  password: z.string({
    required_error: 'Password is required',
  }).min(8, { message: 'Password must be at least 8 characters long' }),
});

/**
 * Schema for validating the input when a user logs in.
 */
export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

/**
 * This schema represents the full user object as it is stored in the database,
 * but without the password. It's useful for defining the shape of the user
 * object that you might pass around in your application or send to the client.
 */
export const userSchema = createUserSchema.extend({
  _id: z.any(),
  image: z.string().nullable().optional(),
  carbon: z.number(),
  achievements: z.array(z.string()),
  actions: z.array(z.string()),
  followers: z.array(z.string()),
  following: z.array(z.string()),
  createdAt: z.date()
}).omit({ password: true });


export function validateUserCreate(object) {
  return createUserSchema.safeParse(object);
}

export function validateUserLogin(object) {
  return loginSchema.safeParse(object);
}

export function validatePartialUser(object) {
  return userSchema.partial().safeParse(object);
}

export function validateUser(object) {
  return userSchema.safeParse(object);
}