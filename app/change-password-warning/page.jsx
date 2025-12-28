// app/change-password-warning/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ChangePasswordWarningPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Si no hay sesión o el usuario no debe cambiar contraseña, redirigir al dashboard
    if (session && !session.user?.mustChangePassword) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleAccept = () => {
    setIsLoading(true);
    // Redirigir a la página de cambio de contraseña
    router.push('/change-password');
  };

  const handleLogout = async () => {
    setIsLoading(true);
    // Cerrar sesión y redirigir al login
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/login');
  };

  // Si no hay sesión, mostrar loading
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Icono de advertencia */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Atención! 🔐
          </h1>
          <p className="text-gray-600">
            Cambio de contraseña requerido
          </p>
        </div>

        {/* Mensaje de advertencia */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Por su seguridad:</strong> Hemos detectado que está utilizando una contraseña por defecto.
                Para proteger su cuenta y mantener la seguridad de sus datos, es obligatorio cambiar su contraseña inmediatamente.
              </p>
            </div>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-blue-800">
            <p><strong>Usuario:</strong> {session.user?.name}</p>
            <p><strong>ID:</strong> {session.user?.id}</p>
          </div>
        </div>

        {/* Mensaje adicional */}
        <div className="text-center text-sm text-gray-600 mb-6">
          <p>
            Una vez que cambie su contraseña, podrá acceder normalmente a todas las funciones del sistema.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 font-medium transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Cambiar Contraseña Ahora
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-300 font-medium transition duration-200"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Información de soporte */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Si tiene problemas para cambiar su contraseña, contacte al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordWarningPage;
