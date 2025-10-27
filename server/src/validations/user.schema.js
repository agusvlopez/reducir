import { z } from 'zod';

/**
 * Schema for validating the input when creating a new user.
 * This only includes the fields a user should provide.
 */
export const createUserSchema = z.object({
  name: z.string({
    required_error: 'Nombre es requerido',
  }).min(1, { message: 'Nombre no puede estar vacio' }),
  username: z.string({
    required_error: 'Nombre de usuario es requerido',
  }).min(1, { message: 'Nombre de usuario no puede estar vacio' }),
  email: z.email({ message: 'Email inválido' }),
  password: z.string({
    required_error: 'La contraseña es requerida',
  }).min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
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
  actions_achieved: z.array(z.string()),
  actions_saved: z.array(z.string()),
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