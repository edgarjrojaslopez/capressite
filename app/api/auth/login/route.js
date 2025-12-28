export const runtime = 'nodejs';

import { db } from '@/lib/db';
import { socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

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

    console.log('Comparando contraseñas...');
    console.log('Contraseña proporcionada:', password);
    console.log('Hash almacenado:', user.password);

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: { message: 'Credenciales inválidas' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Resultado de bcrypt.compare:', isValid);

    // Detecta si la contraseña es la predeterminada
    let mustChangePassword = false;
    if (await bcrypt.compare('password123', user.password)) {
      mustChangePassword = true;
    }

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
