export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '10380699';

    console.log('🔍 Buscando usuario específico:', userId);

    // Buscar el usuario específico
    const userArray = await db
      .select()
      .from(socios)
      .where(eq(socios.CodSocio, userId));

    if (userArray.length === 0) {
      console.log('❌ Usuario no encontrado:', userId);

      // Mostrar usuarios similares para debugging
      const similarUsers = await db
        .select({ CodSocio: socios.CodSocio, NombreCompleto: socios.NombreCompleto })
        .from(socios)
        .where(eq(socios.CodSocio, userId))
        .limit(5);

      return NextResponse.json({
        error: 'Usuario no encontrado',
        userId,
        usuariosSimilares: similarUsers,
        debug: {
          consulta: `SELECT * FROM socios WHERE CodSocio = '${userId}'`,
          timestamp: new Date().toISOString()
        }
      }, { status: 404 });
    }

    const user = userArray[0];
    console.log('✅ Usuario encontrado:', user.CodSocio, user.NombreCompleto);

    return NextResponse.json({
      found: true,
      user: {
        CodSocio: user.CodSocio,
        NombreCompleto: user.NombreCompleto,
        Email: user.Email,
        Estado: user.Estado,
        Telefono: user.Telefono
      },
      debug: {
        consulta: `SELECT * FROM socios WHERE CodSocio = '${userId}'`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 Error buscando usuario:', error);
    return NextResponse.json(
      {
        error: 'Error de base de datos',
        debug: {
          errorMessage: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}
