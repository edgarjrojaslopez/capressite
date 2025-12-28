// lib/validations/authSchema.js
import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  .regex(/[a-z]/, {
    message: 'La contraseña debe contener al menos una letra minúscula',
  })
  .regex(/[A-Z]/, {
    message: 'La contraseña debe contener al menos una letra mayúscula',
  })
  .regex(/[0-9]/, { message: 'La contraseña debe contener al menos un número' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'La contraseña debe contener al menos un carácter especial',
  });

export const resetPasswordSchema = z.object({
  token: z.string().nonempty({ message: 'El token es requerido' }),
  password: passwordSchema,
});
