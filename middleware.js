// middleware.js
import { NextResponse } from 'next/server';

const publicPaths = [
  '/',  // ← Agregar esta línea para la página principal
  '/login',
  '/registro',
  '/recuperar-contrasena',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/public'
];

// Rutas que requieren roles específicos
const roleBasedPaths = {
  '/admin': ['admin'],
  '/moderador': ['admin', 'moderador'],
  '/socio': ['admin', 'moderador', 'socio']
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log('Middleware ejecutándose para:', pathname);

  // Por ahora, permitir todas las rutas para debugging
  // TODO: Implementar autenticación cuando el sistema esté funcionando

  // Permitir rutas públicas
  if (publicPaths.some(path => pathname.startsWith(path))) {
    console.log('Ruta pública permitida:', pathname);
    return NextResponse.next();
  }

  // Temporalmente permitir todas las rutas para debugging
  console.log('Temporalmente permitiendo ruta:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|api/dashboard|_next/static|_next/image|favicon.ico).*)',
  ],
};