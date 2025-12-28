// app/api/change-password-force/route.js
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // ✅ Verificación específica para cambio forzado
    if (!session.user.forcePasswordChange) {
      return NextResponse.json(
        { error: 'Operación no permitida' },
        { status: 403 }
      );
    }

    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: 'ID de usuario y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario en sesión coincida con el que intenta cambiar
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Obtener el usuario actual de la base de datos para verificar
    const [user] = await db
      .select()
      .from(socios)
      .where(eq(socios.CodSocio, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que efectivamente tiene contraseña por defecto
    const hasDefaultPassword = await bcrypt.compare('password123', user.password);
    if (!hasDefaultPassword) {
      return NextResponse.json(
        { error: 'Esta operación solo está disponible para contraseñas por defecto' },
        { status: 400 }
      );
    }

    // Verificar que la nueva contraseña sea diferente a la por defecto
    if (newPassword === 'password123') {
      return NextResponse.json(
        { error: 'No puede usar la contraseña por defecto' },
        { status: 400 }
      );
    }

    // Hashear la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    await db
      .update(socios)
      .set({
        password: hashedNewPassword,
      })
      .where(eq(socios.CodSocio, userId));

    console.log(`✅ Contraseña cambiada exitosamente para usuario: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al cambiar contraseña obligatoriamente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
