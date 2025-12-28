// app/api/change-password/route.js
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Usar la función auth directamente en lugar de getServerSession
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Contraseña actual y nueva son requeridas' },
        { status: 400 }
      );
    }

    // Obtener el usuario actual de la base de datos
    const [user] = await db
      .select()
      .from(socios)
      .where(eq(socios.CodSocio, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar la contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Contraseña actual incorrecta' },
        { status: 400 }
      );
    }

    // Verificar que la nueva contraseña sea diferente
    const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);
    if (isNewPasswordSame) {
      return NextResponse.json(
        { error: 'La nueva contraseña debe ser diferente a la actual' },
        { status: 400 }
      );
    }

    // Hashear la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos y resetear el flag mustChangePassword
    await db
      .update(socios)
      .set({
        password: hashedNewPassword,
        mustChangePassword: false // Resetear el flag después del cambio
      })
      .where(eq(socios.CodSocio, session.user.id));

    console.log(`✅ Contraseña cambiada exitosamente para usuario: ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
