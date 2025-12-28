import LoginForm from '@/components/LoginForm';

export default async function Login({ searchParams }) {
  // ✅ En Next.js 15, searchParams es una promesa que debe ser awaited
  const params = await searchParams;
  const message = params?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        {message === 'password-changed' && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            ✅ ¡Contraseña cambiada exitosamente! Por favor, inicia sesión con tu nueva contraseña.
          </div>
        )}

        <LoginForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿Primera vez?{' '}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
