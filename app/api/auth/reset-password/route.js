// app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { passwordResetTokens, socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { resetPasswordSchema } from '@/lib/validations/authSchema';

export async function PUT(request) {
  try {
    const body = await request.json();

    // Validar el cuerpo de la solicitud con Zod
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    // Hashear el token recibido
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Buscar token válido
    const [tokenRecord] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, hashedToken))
      .limit(1);

    if (!tokenRecord) {
      return NextResponse.json(
        { error: 'El enlace de recuperación es inválido o ha expirado' },
        { status: 400 }
      );
    }

    if (tokenRecord.used) {
      return NextResponse.json(
        { error: 'Este enlace de recuperación ya ha sido utilizado' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      return NextResponse.json(
        { error: 'El enlace de recuperación ha expirado' },
        { status: 400 }
      );
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Actualizar contraseña y token en una transacción
    await db.transaction(async (tx) => {
      // 1. Actualizar la contraseña del socio
      await tx
        .update(socios)
        .set({ password: hashedPassword })
        .where(eq(socios.CodSocio, tokenRecord.userId));

      // 2. Marcar el token como utilizado
      await tx
        .update(passwordResetTokens)
        .set({ used: true })
        .where(eq(passwordResetTokens.id, tokenRecord.id));
    });

    return NextResponse.json({
      message:
        '¡Contraseña actualizada con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.',
    });
  } catch (error) {
    // Manejo de errores de Zod
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Error en reset-password:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
