// app/forgot-password/ForgotPasswordForm.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordForm() {
  const [cedula, setCedula] = useState('');
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: false,
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula: cedula.trim() }),
      });

      // Manejar errores HTTP
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error en la solicitud');
      }

      const data = await res.json();
      setStatus({
        loading: false,
        success: true,
        message: data.message,
      });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.message || 'Error al procesar la solicitud',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {status.error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{status.error}</p>
        </div>
      )}

      {status.success ? (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">{status.message}</p>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Volver al login
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="cedula" className="sr-only">
                Cédula
              </label>
              <input
                id="cedula"
                name="cedula"
                type="text"
                required
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese su cédula"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={status.loading}
            >
              {status.loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <LockClosedIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Enviar enlace de recuperación
                </>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
