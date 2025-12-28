export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { haberes, prestamos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '10380699';

    console.log('🔍 Verificando datos financieros para usuario:', userId);

    // Verificar haberes
    const haberesData = await db
      .select()
      .from(haberes)
      .where(eq(haberes.codSocio, userId));

    console.log('📊 Haberes encontrados:', haberesData.length);
    console.log('📋 Datos de haberes:', haberesData);

    // Verificar préstamos
    const prestamosData = await db
      .select()
      .from(prestamos)
      .where(eq(prestamos.codSocio, userId));

    console.log('📊 Préstamos encontrados:', prestamosData.length);
    console.log('📋 Datos de préstamos:', prestamosData);

    // Verificar estructura de tablas
    const haberesColumns = await db
      .select()
      .from(haberes)
      .limit(1);

    const prestamosColumns = await db
      .select()
      .from(prestamos)
      .limit(1);

    console.log('🏗️ Estructura de tabla haberes:', Object.keys(haberesColumns[0] || {}));
    console.log('🏗️ Estructura de tabla prestamos:', Object.keys(prestamosColumns[0] || {}));

    // Obtener algunos ejemplos de otras tablas para referencia
    const sampleHaberes = haberesData.slice(0, 3);
    const samplePrestamos = prestamosData.slice(0, 3);

    return NextResponse.json({
      userId,
      haberes: {
        count: haberesData.length,
        data: sampleHaberes,
        sampleStructure: haberesColumns[0] || null,
        fullStructure: Object.keys(haberesColumns[0] || {})
      },
      prestamos: {
        count: prestamosData.length,
        data: samplePrestamos,
        sampleStructure: prestamosColumns[0] || null,
        fullStructure: Object.keys(prestamosColumns[0] || {})
      },
      debug: {
        timestamp: new Date().toISOString(),
        queryHaberes: `SELECT * FROM haberes WHERE codSocio = '${userId}'`,
        queryPrestamos: `SELECT * FROM prestamos WHERE codSocio = '${userId}'`
      }
    });

  } catch (error) {
    console.error('💥 Error verificando datos financieros:', error);
    return NextResponse.json(
      {
        error: 'Error verificando datos financieros',
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
