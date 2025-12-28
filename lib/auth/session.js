// lib/auth/session.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function requireAuth(request, roles = []) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (!token.activo) {
    const url = new URL('/login', request.url);
    url.searchParams.set('error', 'AccountDisabled');
    return NextResponse.redirect(url);
  }

  if (roles.length > 0 && !roles.includes(token.rol)) {
    return NextResponse.redirect(new URL('/acceso-denegado', request.url));
  }

  return token;
}

// Wrapper para rutas de API protegidas
export function withAuth(handler, roles = []) {
  return async (request) => {
    try {
      const token = await requireAuth(request, roles);
      if (token instanceof NextResponse) return token;
      return handler(request, token);
    } catch (error) {
      return NextResponse.json(
        { error: error.message || 'No autorizado' },
        { status: 401 }
      );
    }
  };
}

// Verificar permisos de usuario
export function hasPermission(userRole, requiredRole) {
  const roleHierarchy = {
    'socio': 1,
    'moderador': 2,
    'admin': 3
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}