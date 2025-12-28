// components/Header.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false); // Para el menú del usuario
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Para el menú móvil
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      setMobileMenuOpen(false); // Cerrar menú móvil al salir
      setShowMenu(false);
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback: redirect to home
      router.push('/');
    }
  };

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
              <div className="relative w-14 h-14 md:w-16 md:h-16 bg-white p-1">
                <Image
                  src="/assets/images/capres.jpg"
                  alt="Logo CAPRES"
                  fill
                  sizes="(max-width: 768px) 48px, 64px"
                  className="object-contain"
                />
              </div>
            </Link>
          </div>
          <div className="text-white">Cargando...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white focus:outline-none mr-2"
            aria-label="Menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <Link
            href="/"
            className="flex items-center space-x-4 hover:opacity-90 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-white p-1">
              <Image
                src="/assets/images/capres.jpg"
                alt="Logo CAPRES"
                fill
                sizes="(max-width: 768px) 48px, 64px"
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Menú Desktop (oculto en móvil) */}
        <nav className="hidden md:flex space-x-8  items-center">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <Link href="/about" className="hover:underline">
            Nosotros
          </Link>
          {/* Menú de Servicios */}
          <div className="relative group">
            <button
              type="button"
              className="hover:underline focus:outline-none py-2"
            >
              Servicios
            </button>
            <div className="absolute hidden group-hover:block pt-2 right-0 w-48 bg-transparent z-10">
              <div className="bg-white text-gray-800 rounded shadow-lg">
                <Link
                  href="/loans"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Préstamos
                </Link>
                <Link
                  href="/retiros"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Retiros
                </Link>
              </div>
            </div>
          </div>
          <Link href="/delegates" className="hover:underline">
            Delegados
          </Link>
          <Link href="/documents" className="hover:underline">
            Documentos
          </Link>
          <Link href="/contact" className="hover:underline">
            Contacto
          </Link>

          {/* Menú de usuario (desktop) */}
          {session?.user ? (
            <div className="relative">
              <button
                type="button"
                className="px-3 py-2 mx-auto rounded-md focus:outline-none bg-blue-700 hover:bg-blue-600 transition-colors"
                onClick={() => setShowMenu(!showMenu)}
              >
                👤 {session.user.name || session.user.nombre || 'Usuario'}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
<Link
                    href="/dashboard"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600 hover:text-red-700"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:underline bg-blue-700 px-4 py-2 rounded transition-colors hover:bg-blue-600">
              🔐 Iniciar Sesión
            </Link>
          )}
        </nav>

        {/* Menú Móvil (solo visible en móvil) */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-blue-800 text-white z-50 flex flex-col p-6">
            {/* Botón de cierre */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white"
                aria-label="Cerrar menú"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Enlaces del menú */}
            <nav className="flex-1 flex flex-col space-y-6 text-xl">
              <Link
                href="/"
                className="hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/about"
                className="hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nosotros
              </Link>

              {/* Servicios en móvil */}
              <div>
                <span className="font-bold">Servicios</span>
                <div className="flex flex-col space-y-4 pl-4 mt-2">
                  <Link
                    href="/loans"
                    className="hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Préstamos
                  </Link>
                  <Link
                    href="/retiros"
                    className="hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Retiros
                  </Link>
                </div>
              </div>

              <Link
                href="/delegates"
                className="hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Delegados
              </Link>
              <Link
                href="/documents"
                className="hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentos
              </Link>
              <Link
                href="/contact"
                className="hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>

              {session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-left hover:underline text-red-300 hover:text-red-200"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔐 Iniciar Sesión
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
