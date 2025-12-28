// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { socios, passwordResetTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes, createHash } from 'crypto';
import { sendPasswordResetEmail } from '@/lib/mail.js';

export async function POST(request) {
  try {
    // Validar Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Formato inválido (se requiere JSON)' },
        { status: 415 }
      );
    }

    // Leer y validar cuerpo
    const body = await request.json();
    const { cedula } = body;

    if (!cedula || typeof cedula !== 'string' || cedula.trim() === '') {
      return NextResponse.json(
        { error: 'El campo cédula es requerido' },
        { status: 400 }
      );
    }

    const normalizedCedula = cedula.trim();

    // Respuesta genérica por seguridad
    const successResponse = {
      message:
        'Si el correo está registrado, recibirás un enlace de recuperación en breve.',
    };

    // Buscar usuario
    const [user] = await db
      .select()
      .from(socios)
      .where(eq(socios.CodSocio, normalizedCedula))
      .limit(1);

    if (!user) {
      return NextResponse.json(successResponse);
    }

    // Verificar que el usuario tenga email
    if (!user.Email) {
      return NextResponse.json(
        { error: 'El usuario no tiene email registrado' },
        { status: 400 }
      );
    }

    // Generar token seguro
    const resetToken = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    // Eliminar tokens existentes para este usuario
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.CodSocio));

    // Guardar nuevo token
    await db.insert(passwordResetTokens).values({
      userId: user.CodSocio,
      token: hashedToken,
      expiresAt,
    });

    

    // Enviar correo (manejar errores silenciosamente)
    try {
      await sendPasswordResetEmail({
        email: user.Email,
        token: resetToken,
        name: user.NombreCompleto,
      });
    } catch (emailError) {
      console.error('Error enviando correo:', emailError);
      // No revelar error al cliente
    }

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('Error en /api/auth/forgot-password:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}