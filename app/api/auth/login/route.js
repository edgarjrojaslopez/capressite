export const runtime = 'nodejs';

import { db } from '@/lib/db';
import { socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { shouldForcePasswordChange } from '@/lib/auth-utils';
import { passwordSchema } from '@/lib/validations/authSchema';

export async function POST(req) {
  try {
    const { cedula, password } = await req.json();
    console.log('Intento de login para cédula:', cedula);

    // Validaciones de entrada
    if (!cedula || !password) {
      return new Response(
        JSON.stringify({ error: { message: 'Cédula y contraseña son requeridas' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar cédula
    if (!/^\d{1,10}$/.test(cedula)) {
      return new Response(
        JSON.stringify({ error: { message: 'La cédula debe contener solo números (máximo 10 dígitos)' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [user] = await db
      .select()
      .from(socios)
      .where(eq(socios.CodSocio, cedula));

    console.log('Usuario encontrado en BD:', user ? 'Sí' : 'No');

    if (!user) {
      return new Response(
        JSON.stringify({ error: { message: 'Credenciales inválidas' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar la complejidad de la contraseña suministrada
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      return new Response(
        JSON.stringify({ error: { message: passwordValidation.error.errors[0].message } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar la coincidencia con el hash almacenado
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: { message: 'Credenciales inválidas' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Detecta si la contraseña es la predeterminada
    const mustChangePassword = await shouldForcePasswordChange(user.password);

    // Devolver respuesta en el formato que espera NextAuth
    const responseData = {
      user: {
        id: user.CodSocio,
        nombre: user.NombreCompleto,
        rol: user.rol,
        email: user.Email || `${user.CodSocio}@capres.com`
      },
      mustChangePassword
    };

    console.log('Enviando respuesta de login:', JSON.stringify(responseData, null, 2));

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return new Response(
      JSON.stringify({ error: { message: 'Error interno del servidor' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
