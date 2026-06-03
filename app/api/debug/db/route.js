// app/api/debug/db/route.js
export const runtime = 'nodejs';

import { db } from '@/lib/db';
import { socios, haberes, prestamos } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

export async function GET(request) {
  try {
    console.log('🔍 Debug DB - Verificando conexión a base de datos');

    // Probar conexión básica
    const testQuery = await db.select().from(socios).limit(1);
    console.log('✅ Conexión a BD exitosa, usuarios encontrados:', testQuery.length);

    // Obtener usuarios de ejemplo
    const sampleUsers = await db
      .select({
        CodSocio: socios.CodSocio,
        NombreCompleto: socios.NombreCompleto,
        Email: socios.Email,
        Estado: socios.Estado
      })
      .from(socios)
      .limit(10);

    console.log('🔍 Usuarios encontrados:', sampleUsers.length);

    // Obtener estadísticas de forma eficiente
    const [sociosCountResult] = await db.select({ count: sql`count(*)` }).from(socios);
    const [haberesCountResult] = await db.select({ count: sql`count(*)` }).from(haberes);
    const [prestamosCountResult] = await db.select({ count: sql`count(*)` }).from(prestamos);

    const debugInfo = {
      conexion: 'exitosa',
      estadisticas: {
        totalSocios: Number(sociosCountResult?.count || 0),
        totalHaberes: Number(haberesCountResult?.count || 0),
        totalPrestamos: Number(prestamosCountResult?.count || 0)
      },
      usuariosEjemplo: sampleUsers,
      tablas: {
        socios: 'conectada',
        haberes: 'conectada',
        prestamos: 'conectada'
      }
    };

    console.log('📊 Debug info completo:', debugInfo);

    return NextResponse.json(debugInfo);

  } catch (error) {
    console.error('💥 Error en debug DB:', error);
    return NextResponse.json(
      {
        error: 'Error de conexión a base de datos',
        debug: {
          errorMessage: error.message,
          stack: error.stack
        }
      },
      { status: 500 }
    );
  }
}
