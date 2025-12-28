export const runtime = 'nodejs';

import { db } from '@/lib/db';
import { socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { currentPassword, newPassword } = await req.json();

    // 1. Obtener token del header o cookie
    let token = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.get('token')) {
      token = req.cookies.get('token').value;
    }
    if (!token) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
      });
    }

    let payload;
    try {
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      ({ payload } = await jwtVerify(token, secretKey));
    } catch {
      return new Response(JSON.stringify({ error: 'Token inválido' }), {
        status: 401,
      });
    }

    const codSocio = payload.cedula;
    const [user] = await db
      .select()
      .from(socios)
      .where(eq(socios.CodSocio, codSocio));

    if (!user) {
      return new Response(JSON.stringify({ error: 'Socio no encontrado' }), {
        status: 404,
      });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Contraseña actual incorrecta' }),
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return new Response(
        JSON.stringify({
          error: 'La nueva contraseña debe tener al menos 8 caracteres',
        }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(socios)
      .set({ password: hashedPassword })
      .where(eq(socios.CodSocio, codSocio));

    // Generar nuevo JWT sin mustChangePassword
    const newToken = await new SignJWT({
      cedula: user.CodSocio,
      nombre: user.NombreCompleto,
      rol: user.rol,
      mustChangePassword: false,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET));

    const isProd = process.env.NODE_ENV === 'production';
    const cookie = [
      `token=${newToken}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Strict',
      isProd ? 'Secure' : '',
      'Max-Age=604800',
    ]
      .filter(Boolean)
      .join('; ');

    return new Response(
      JSON.stringify({ success: true, message: 'Contraseña actualizada' }),
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error en cambio de contraseña:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 }
    );
  }
}
