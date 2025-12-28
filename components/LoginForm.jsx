// components/LoginForm.jsx
'use client';
import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginForm() {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    // Verificar si ya está autenticado y redirigir al dashboard
    const checkAuth = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          console.log('Usuario ya autenticado, redirigiendo al dashboard');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Intentando login con cédula:', cedula);

      const result = await signIn('credentials', {
        redirect: false,
        cedula: cedula.trim(),
        password,
      });

      console.log('📡 Resultado de signIn:', result);

      if (result?.error) {
        console.error('❌ Error de autenticación:', result.error);
        setError('Cédula o contraseña incorrectos');
        return;
      }

      if (result?.ok) {
        console.log('✅ Login exitoso, verificando estado de contraseña...');

        // Verificar que la sesión se estableció correctamente antes de redirigir
        let retries = 0;
        const maxRetries = 10;

        while (retries < maxRetries) {
          try {
            const session = await getSession();
            if (session?.user) {
              console.log('✅ Sesión confirmada');

              // Verificar si el usuario debe cambiar la contraseña directamente (contraseña por defecto)
              if (session.user.forcePasswordChange) {
                console.log('🔐 Usuario con contraseña por defecto, redirigiendo a cambio obligatorio');
                router.push('/change-password');
                return;
              }

              // Verificar si el usuario debe cambiar la contraseña (otros casos)
              if (session.user.mustChangePassword) {
                console.log('🔄 Usuario debe cambiar contraseña, redirigiendo a página de cambio');
                router.push('/change-password');
                return;
              }

              // Usuario normal, redirigir al dashboard
              console.log('✅ Usuario con contraseña normal, redirigiendo al dashboard');
              router.push('/dashboard');
              return;
            }
          } catch (error) {
            console.log('⏳ Esperando sesión...', retries + 1);
          }

          retries++;
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.log('⚠️ Timeout esperando sesión, redirigiendo de todos modos');
        router.push('/dashboard');
      } else {
        console.error('❌ Resultado inesperado:', result);
        setError('Error inesperado durante el login');
      }
    } catch (error) {
      console.error('💥 Error en handleSubmit:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="cedula">Cédula</Label>
          <Input
            id="cedula"
            type="text"
            placeholder="Ingrese su cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            required
            disabled={loading}
            maxLength={20}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              maxLength={100}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        <div className="text-center space-y-2">
          <a
            href="/forgot-password"
            className="text-sm text-gray-600 hover:text-blue-600"
          >
            ¿Olvidaste tu contraseña?
          </a>

        </div>
      </form>
    </div>
  );
}
