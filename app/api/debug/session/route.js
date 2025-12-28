export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log('🔍 Debug Session - Verificando sesión del servidor');

    // Obtener la sesión del servidor
    const session = await auth();

    console.log('🔍 Sesión del servidor:', {
      session: !!session,
      user: session?.user,
      expires: session?.expires
    });

    if (!session?.user) {
      console.log('❌ No hay sesión del servidor');
      const headers = new Headers(request.headers);
      return NextResponse.json({
        error: 'No hay sesión del servidor',
        session: null,
        debug: {
          timestamp: new Date().toISOString(),
          hasUserAgent: headers.has('user-agent'),
          hasCookies: headers.has('cookie')
        }
      });
    }

    // Verificar que el usuario existe en la BD
    const { db } = await import('@/lib/db');
    const { socios } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');

    const userArray = await db
      .select()
      .from(socios)
      .where(eq(socios.CodSocio, session.user.id));

    console.log('🔍 Usuario en BD:', {
      encontrado: userArray.length > 0,
      userId: session.user.id,
      bdUser: userArray[0]
    });

    return NextResponse.json({
      session: {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email
        },
        expires: session.expires
      },
      database: {
        userFound: userArray.length > 0,
        userData: userArray[0] || null
      },
      debug: {
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent'),
        cookies: request.headers.get('cookie')
      }
    });

  } catch (error) {
    console.error('💥 Error en debug session:', error);
    return NextResponse.json(
      {
        error: 'Error verificando sesión',
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
