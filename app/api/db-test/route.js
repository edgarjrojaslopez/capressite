// app/api/db-test/route.js
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

// Endpoint temporal para diagnosticar la conexión a la BD.
export async function GET() {
  try {
    // Realizamos una consulta simple para verificar la conexión
    await db.execute(sql`SELECT 1`);
    
    const config = {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      database: process.env.MYSQL_DATABASE,
    };

    console.log('✅ Test de conexión a la BD exitoso. Configuración utilizada:', config);

    return NextResponse.json({ 
      status: 'success', 
      message: 'La conexión a la base de datos fue exitosa.',
      config: config
    });

  } catch (error) {
    const config = {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      database: process.env.MYSQL_DATABASE,
    };

    console.error('❌ Falló el test de conexión a la BD. Configuración utilizada:', config);
    console.error('Error detallado:', error);

    return NextResponse.json(
      { 
        status: 'error', 
        message: 'No se pudo conectar a la base de datos.',
        error: {
          message: error.message,
          code: error.code,
        },
        config: config
      }, 
      { status: 500 }
    );
  }
}
