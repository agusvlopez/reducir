import z from "zod";

export const userRegisterSchema = z.object({
  name: z.string({
    required_error: 'El nombre es requerido',
  }).min(1, { message: 'El nombre no puede estar vacío' }),
  username: z.string({
    required_error: 'El nombre de usuario es requerido',
  }).min(1, { message: 'El nombre de usuario no puede estar vacío' }),
  email: z.email({ message: 'Email no válido' }),
  password: z.string({
    required_error: 'La contraseña es obligatoria',
  }).min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  confirmPassword: z.string({
    required_error: 'La contraseña es obligatoria',
  }).min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"] //show error on confirmPassword field
});

export const userLoginSchema = z.object({
    email: z.email({ message: 'Email no válido' }),
    password: z.string({
        required_error: 'La contraseña es obligatoria',
    }).min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
});