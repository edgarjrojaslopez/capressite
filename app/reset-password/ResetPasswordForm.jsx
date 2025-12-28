// app/reset-password/ResetPasswordForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: false,
    tokenValid: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  // Validar token al cargar
  useEffect(() => {
    if (!token) {
      setStatus({
        tokenValid: false,
        error: 'Falta el token de recuperación en la URL',
      });
      return;
    }

    const validateToken = async () => {
      try {
        setStatus((prev) => ({ ...prev, loading: true }));

        const res = await fetch('/api/auth/validate-reset-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok || !data.valid) {
          setStatus({
            loading: false,
            tokenValid: false,
            error: data.error || 'Token inválido o expirado',
            success: false,
          });
        } else {
          setStatus((prev) => ({ ...prev, tokenValid: true, loading: false }));
        }
      } catch (err) {
        setStatus({
          loading: false,
          tokenValid: false,
          error: 'Error de conexión. Intenta nuevamente',
          success: false,
        });
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (status.error) setStatus((prev) => ({ ...prev, error: '' }));
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setStatus((prev) => ({ ...prev, error: 'Las contraseñas no coinciden' }));
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setStatus((prev) => ({ ...prev, error: passwordError }));
      return;
    }

    setStatus((prev) => ({ ...prev, loading: true, error: '' }));

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: formData.password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          loading: false,
          success: true,
          error: '',
          tokenValid: true,
        });

        setTimeout(() => router.push('/login'), 3000);
      } else {
        setStatus({
          loading: false,
          success: false,
          error: data.error || 'Error al actualizar la contraseña',
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: 'Error de red. Intenta nuevamente',
      });
    }
  };

  if (status.loading || status.tokenValid === null) {
    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p>Validando enlace de recuperación...</p>
      </div>
    );
  }

  if (!status.tokenValid) {
    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-3 text-xl font-bold text-gray-900">
            Enlace inválido
          </h2>
          <p className="mt-2 text-gray-600">{status.error}</p>
        </div>

        <button
          onClick={() => router.push('/forgot-password')}
          className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Solicitar nuevo enlace
        </button>
      </div>
    );
  }

  if (status.success) {
    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-3 text-xl font-bold text-gray-900">
            ¡Contraseña actualizada!
          </h2>
          <p className="mt-2 text-gray-600">
            Serás redirigido al inicio de sesión en unos segundos...
          </p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Restablecer contraseña
        </h1>
        <p className="mt-2 text-gray-600">
          Crea una nueva contraseña segura para tu cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {status.error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{status.error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Introduce tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p className="font-semibold">La contraseña debe contener:</p>
              <ul className="list-disc list-inside pl-2">
                <li>Al menos 8 caracteres</li>
                <li>Al menos una letra mayúscula (A-Z)</li>
                <li>Al menos una letra minúscula (a-z)</li>
                <li>Al menos un número (0-9)</li>
                <li>Al menos un carácter especial (ej. !@#$%^&*)</li>
              </ul>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={status.loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {status.loading ? 'Actualizando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
}