'use client';

import { useState } from 'react';

export default function ForgotPassword() {
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // 1: cédula, 2: ingresar correo

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula }),
      });

      const data = await res.json();

      if (data.requiresEmail) {
        setStep(2); // Pedir correo
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula, email }),
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage(
          '¡Correo enviado! Revisa tu bandeja para restablecer tu contraseña.'
        );
        setStep(1);
        setCedula('');
        setEmail('');
      }
    } catch (err) {
      setMessage('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🔐 Recuperar Contraseña
      </h2>

      {step === 1 && (
        <form onSubmit={handleSubmitStep1} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Verificando...' : 'Continuar'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmitStep2} className="space-y-5">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Este socio no tiene un correo registrado. Por favor, ingresa tu
              correo electrónico para recibir el enlace de recuperación.
            </p>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </div>
        </form>
      )}

      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.includes('Error') || message.includes('no válido')
              ? 'text-red-600'
              : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}

      <div className="mt-6 text-center">
        <a href="/login" className="text-blue-600 hover:underline text-sm">
          ← Volver al inicio de sesión
        </a>
      </div>
    </div>
  );
}
