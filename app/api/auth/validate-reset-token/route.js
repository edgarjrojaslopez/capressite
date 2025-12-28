// app/api/auth/validate-reset-token/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { passwordResetTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token no proporcionado' },
        { status: 400 }
      );
    }

    const hashedToken = createHash('sha256').update(token).digest('hex');

    const [tokenRecord] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, hashedToken))
      .limit(1);

    if (!tokenRecord) {
      return NextResponse.json({
        valid: false,
        error: 'El enlace de recuperación es inválido o ha expirado',
      });
    }

    if (tokenRecord.used) {
      return NextResponse.json({
        valid: false,
        error: 'Este enlace ya ha sido utilizado',
      });
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      return NextResponse.json({
        valid: false,
        error: 'El enlace de recuperación ha expirado',
      });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: 'Error de servidor' },
      { status: 500 }
    );
  }
}
