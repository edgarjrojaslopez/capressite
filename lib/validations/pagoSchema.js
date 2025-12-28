// /app/lib/validations/pagoSchema.js
import { z } from 'zod';

const pagoSchema = z.object({
  prestamoId: z.string().min(1, 'El ID del préstamo es requerido'),
  monto: z.number().positive('El monto debe ser mayor a cero'),
  fechaPago: z.string().datetime().optional(), // formato ISO
  numeroCuota: z.number().int().min(1, 'Número de cuota inválido'),
});

export const validatePago = (data) => {
  return pagoSchema.parse(data);
};

export const validatePartialPago = (data) => {
  return pagoSchema.partial().parse(data);
};
