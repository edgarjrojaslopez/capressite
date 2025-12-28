// app/api/debug/db/route.js
export const runtime = 'nodejs';

import { db } from '@/lib/db';
import { socios, haberes, prestamos } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

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

    // Obtener estadísticas
    const totalSocios = await db.select().from(socios);
    const totalHaberes = await db.select().from(haberes);
    const totalPrestamos = await db.select().from(prestamos);

    const debugInfo = {
      conexion: 'exitosa',
      estadisticas: {
        totalSocios: totalSocios.length,
        totalHaberes: totalHaberes.length,
        totalPrestamos: totalPrestamos.length
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
