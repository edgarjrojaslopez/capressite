export const runtime = 'nodejs';

import { db } from '@/lib/db';
import { socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

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
      return new Response(JSON.stringify({ error: { message: 'No autorizado' } }), {
        status: 401,
      });
    }

    let payload;
    try {
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      ({ payload } = await jwtVerify(token, secretKey));
    } catch {
      return new Response(JSON.stringify({ error: { message: 'Token inválido' } }), {
        status: 401,
      });
    }

    const codSocio = payload.cedula;
    const [user] = await db
      .select()
      .from(socios)
      .where(eq(socios.CodSocio, codSocio));

    if (!user) {
      return new Response(JSON.stringify({ error: { message: 'Socio no encontrado' } }), {
        status: 404,
      });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: { message: 'Contraseña actual incorrecta' } }),
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return new Response(
JSON.stringify({
            error: { message: 'La nueva contraseña debe tener al menos 8 caracteres' }
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
      JSON.stringify({ error: { message: 'Error interno del servidor' } }),
      { status: 500 }
    );
  }
}
