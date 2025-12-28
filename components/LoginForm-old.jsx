// components/LoginForm.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'next/navigation';

export default function LoginForm() {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ← Controla si se muestra la contraseña
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cedula, password }),
      });

      const data = await res.json();

      // Verificar si la contraseña es válida
      const storedHash = data.storedHash;
      const isValid = await bcrypt.compare(password, storedHash);

      if (!isValid) {
        setError('Contraseña inválida');
        return;
      }

      // Guardar token en cookie y localStorage
      document.cookie = `token=${data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; secure; samesite=strict`;
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));

      // Si debe cambiar la contraseña, muestra mensaje y redirige
      if (data.mustChangePassword) {
        alert(
          'Por su seguridad, debe cambiar su contraseña antes de continuar.'
        );
        router.push('/change-password');
        return;
      }

      // Redirigir al dashboard
      const navigate = useNavigate();
      navigate('/dashboard');
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">🔐 Iniciar Sesión</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campo Cédula */}
        <div>
          <label
            htmlFor="cedula"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cédula
          </label>
          <input
            type="text"
            id="cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ingresa tu cédula"
            required
          />
        </div>

        {/* Campo Contraseña con ícono de ojo */}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
            placeholder="Ingresa tu contraseña"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-6 right-0 translate-y-1/2 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:text-blue-600 z-10"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded">
            {error}
          </div>
        )}

        {/* Enlace a recuperación de contraseña */}
        <div className="text-center">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
