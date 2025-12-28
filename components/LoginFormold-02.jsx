'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // ✅ NUEVO: usamos signIn de NextAuth

export default function LoginForm({ onSuccess, onError = () => {} }) {
  const [cedula, setCedula] = useState(''); // ✅ Cambiado de email a cedula
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Iniciando sesión con cédula:', cedula);
      const result = await signIn('credentials', {
        redirect: false,
        cedula,
        password,
      });

      console.log('Respuesta de signIn:', result);

      if (result?.error) {
        console.error('Error en signIn:', result.error);
        setError('Cédula o contraseña incorrectas');
        setLoading(false);
        onError();
      } else {
        console.log('Inicio de sesión exitoso, redirigiendo...');
        // ✅ Redirige a dashboard si todo sale bien
        router.push('/dashboard');
        router.refresh(); // Asegurar que se actualice el estado de autenticación
        onSuccess();
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      setLoading(false);
      onError();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Cédula"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Iniciando...' : 'Iniciar sesión'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
