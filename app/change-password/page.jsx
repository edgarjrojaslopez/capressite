// app/change-password/page.jsx
'use client';

import { Suspense } from 'react';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
const PasswordInput = ({ label, value, onChange, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={
            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
          }
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );
};

// Componente wrapper para manejar useSearchParams con Suspense
const ChangePasswordWrapper = () => {
  const searchParams = useSearchParams();

  return <ChangePasswordPage />;
};

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  // Detectar si es un cambio obligatorio por contraseña por defecto
  const isForceChange = session?.user?.forcePasswordChange;
  const showCurrentPassword = !isForceChange; // No mostrar campo de contraseña actual si es cambio obligatorio

  useEffect(() => {
    // Si no hay sesión válida, redirigir al login
    if (!session?.user?.id) {
      router.push('/login');
      return;
    }

    // Si no requiere cambio de contraseña y no es cambio forzado, redirigir al dashboard
    if (!session.user.mustChangePassword && !session.user.forcePasswordChange) {
      router.push('/dashboard');
      return;
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword === 'password123') {
      setError('No puede usar la contraseña por defecto');
      return;
    }

    if (!session?.user?.id) {
      setError('Sesión no válida. Por favor, inicia sesión nuevamente.');
      return;
    }

    setLoading(true);
    try {
      let response;

      if (isForceChange) {
        // Cambio obligatorio por contraseña por defecto - no requiere contraseña actual
        response = await fetch('/api/change-password-force', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            newPassword,
          }),
        });
      } else {
        // Cambio normal - requiere contraseña actual
        const currentPassword = e.target.currentPassword?.value;
        if (!currentPassword) {
          setError('La contraseña actual es requerida');
          setLoading(false);
          return;
        }

        response = await fetch('/api/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });
      }

      const data = await response.json();

      if (response.ok && data.success) {
        if (isForceChange) {
          // Cambio obligatorio - cerrar sesión y redirigir al login
          setSuccess('¡Contraseña actualizada exitosamente! Redirigiendo al login...');
          await fetch('/api/auth/signout', { method: 'POST' });
          setTimeout(() => {
            router.push('/login?message=password-changed');
          }, 2000);
        } else {
          // Cambio normal - redirigir al dashboard
          setSuccess('La contraseña se cambió con éxito. Redirigiendo...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } else {
        setError(data.error || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Si no hay sesión o no requiere cambio, mostrar loading
  if (!session || (!session.user.mustChangePassword && !session.user.forcePasswordChange)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header con contexto diferente según el tipo de cambio */}
        <div className="text-center mb-6">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isForceChange ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <svg
              className={`w-8 h-8 ${isForceChange ? 'text-red-600' : 'text-blue-600'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isForceChange ? '🔐 Cambio de Contraseña Requerido' : '🔄 Cambiar Contraseña'}
          </h1>
          <p className="text-gray-600">
            {isForceChange ? 'Seguridad obligatoria' : 'Actualización de contraseña'}
          </p>
        </div>

        {/* Información del usuario */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-blue-800">
            <p><strong>Usuario:</strong> {session.user?.name}</p>
            <p><strong>ID:</strong> {session.user?.id}</p>
          </div>
        </div>

        {/* Mensaje específico según el contexto */}
        {isForceChange && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Por su seguridad:</strong> Hemos detectado que estaba usando una contraseña por defecto.
                  Para proteger su cuenta y mantener la seguridad de sus datos, debe establecer una nueva contraseña antes de continuar.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Solo mostrar contraseña actual si NO es cambio obligatorio */}
          {!isForceChange && (
            <PasswordInput
              label="Contraseña actual"
              name="currentPassword"
              required
            />
          )}

          <PasswordInput
            label="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
          />
          <PasswordInput
            label="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita la nueva contraseña"
            required
          />

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm text-center bg-green-50 py-2 px-3 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 font-medium rounded-md transition duration-200 flex items-center justify-center ${
              isForceChange
                ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isForceChange ? 'Actualizando...' : 'Cambiando...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isForceChange ? 'Establecer Nueva Contraseña' : 'Cambiar Contraseña'}
              </>
            )}
          </button>
        </form>

        {/* Información adicional */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            {isForceChange
              ? 'Después de cambiar su contraseña, será redirigido al login para iniciar sesión normalmente.'
              : 'Después de cambiar su contraseña, será redirigido al dashboard.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default function ChangePassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <ChangePasswordWrapper />
    </Suspense>
  );
}
