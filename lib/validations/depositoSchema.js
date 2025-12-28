// /app/lib/validations/depositoSchema.js
import { z } from 'zod';

const depositoSchema = z.object({
  usuarioId: z.string().min(1, 'El ID del usuario es requerido'),
  monto: z.number().positive('El monto debe ser mayor a cero'),
  fechaDeposito: z.string().datetime().optional(), // formato ISO
  tipo: z
    .enum(['efectivo', 'transferencia', 'cheque'], {
      message: 'Tipo de depósito inválido',
    })
    .optional(),
});

export const validateDeposito = (data) => {
  return depositoSchema.parse(data);
};

export const validatePartialDeposito = (data) => {
  return depositoSchema.partial().parse(data);
};
