'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardContent from '@/components/DashboardContent';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [hasTriedOnce, setHasTriedOnce] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Función para probar la conexión a la BD y sesión del servidor
    const testDatabaseConnection = async () => {
      try {
        console.log('🔍 Probando conexión a BD...');
        const response = await fetch('/api/debug/db');
        const data = await response.json();
        console.log('📊 Debug info:', data);
        setDebugInfo(data);
        return data;
      } catch (error) {
        console.error('💥 Error en testDatabaseConnection:', error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        // Debug: mostrar estado de la sesión
        console.log('🔍 Estado de la sesión:', {
          session: !!session,
          status,
          user: session?.user,
          userId: session?.user?.id,
          hasTriedOnce,
        });

        // Si está cargando, esperar
        if (status === 'loading') {
          console.log('⏳ Cargando sesión...');
          return;
        }

        // Si no hay sesión y ya intentamos, redirigir al login
        if (!session?.user && hasTriedOnce) {
          console.log('❌ No hay sesión después de intentar, redirigiendo al login');
          router.push('/login');
          return;
        }

        // Si no hay sesión pero no hemos intentado, esperar más tiempo
        if (!session?.user && !hasTriedOnce) {
          console.log('⏳ Primera vez sin sesión, esperando más tiempo...');
          setHasTriedOnce(true);
          return; // El useEffect se volverá a ejecutar cuando hasTriedOnce cambie
        }

        if (!session?.user) {
          return; // Aún no hay sesión, pero ya se intentó una vez.
        }

        console.log('✅ Usuario autenticado:', session.user);

        // Usar el ID del usuario autenticado
        const userId = session.user.id;
        console.log('📡 Llamando a API con userId:', userId);

        const response = await fetch(`/api/dashboard/me?userId=${userId}`);

        console.log('📡 Respuesta de la API:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          url: response.url,
        });

        if (response.status === 401) {
          console.log('🔒 Respuesta 401 - no autorizado, redirigiendo al login');
          router.push('/login');
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error de API:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });

          // Si es error 404 (usuario no encontrado), mostrar debug info
          if (response.status === 404) {
            console.log('🔍 Usuario no encontrado, probando conexión a BD...');
            await testDatabaseConnection();
          }

          throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Datos del dashboard recibidos:', {
          hasSocio: !!data.socio,
          hasHaberes: !!data.haberes,
          hasPrestamos: !!data.prestamos,
          socioId: data.socio?.CodSocio,
          socioNombre: data.socio?.NombreCompleto,
        });

        setDashboardData(data);
      } catch (error) {
        console.error('💥 Error en fetchDashboardData:', error);
        setError(`Error al cargar datos: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Delay más largo para permitir que la sesión se estabilice completamente
    const timeoutId = setTimeout(() => {
      fetchDashboardData();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [router, session, status, hasTriedOnce]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">
          <div className="mb-2">Cargando dashboard...</div>
          <div className="text-sm text-gray-600">Verifica la consola para más detalles</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600 max-w-2xl mx-auto p-6">
          <div className="mb-4 font-bold text-xl">Error al cargar el dashboard</div>
          <div className="mb-4">{error}</div>

          <div className="bg-gray-100 p-4 rounded mb-4">
            <div className="font-semibold mb-2">🔍 Información de Debug:</div>
            <div className="text-sm space-y-1">
              <div>Usuario autenticado: {session?.user?.id || 'No disponible'}</div>
              <div>Nombre del usuario: {session?.user?.name || 'No disponible'}</div>
              <div>Estado de la sesión: {status}</div>
              <div>Intentos realizados: {hasTriedOnce ? 'Sí' : 'No'}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔄 Recargar página
            </button>

            <button
              onClick={async () => {
                setError('');
                setLoading(true);
                setDebugInfo(null);
                // Estas funciones no están definidas en este scope,
                // si las necesitas, deberías definirlas fuera del useEffect
                // const sessionData = await testServerSession();
                // const dbData = await testDatabaseConnection();
                // console.log('🔍 Debug completo:', { sessionData, dbData });
                window.location.reload();
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              🔍 Debug Completo
            </button>

            <button
              onClick={async () => {
                if (session?.user?.id) {
                  setError('');
                  setLoading(true);
                  setDebugInfo(null);
                  // testFinancialData no está definido, si lo necesitas
                  // deberías definirlo o importarlo.
                  // const financialData = await testFinancialData(session.user.id);
                  // console.log('💰 Datos financieros:', financialData);
                  // setDebugInfo(financialData);
                  setLoading(false);
                }
              }}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              disabled={!session?.user?.id}
            >
              💰 Datos Financieros
            </button>

            <button
              onClick={() => router.push('/login')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              🔐 Volver al login
            </button>
          </div>

          {debugInfo && (
            <div className="mt-6 bg-blue-50 p-4 rounded">
              <div className="font-semibold mb-2">📊 Información de Debug:</div>
              <div className="text-sm">
                {debugInfo.haberes && (
                  <>
                    <div className="font-medium text-green-700">💰 HABERES:</div>
                    <div>Cantidad: {debugInfo.haberes.count}</div>
                    <div className="text-xs text-gray-600">Columnas: {debugInfo.haberes.fullStructure?.join(', ') || 'N/A'}</div>
                    {debugInfo.haberes.count > 0 && (
                      <div className="mt-1">
                        <div className="text-xs font-medium">Datos de haberes:</div>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto max-h-32">
                          {JSON.stringify(debugInfo.haberes.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </>
                )}

                {debugInfo.prestamos && (
                  <>
                    <div className="font-medium text-blue-700 mt-2">💳 PRÉSTAMOS:</div>
                    <div>Cantidad: {debugInfo.prestamos.count}</div>
                    <div className="text-xs text-gray-600">Columnas: {debugInfo.prestamos.fullStructure?.join(', ') || 'N/A'}</div>
                    {debugInfo.prestamos.count > 0 && (
                      <div className="mt-1">
                        <div className="text-xs font-medium">Datos de préstamos:</div>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto max-h-32">
                          {JSON.stringify(debugInfo.prestamos.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </>
                )}

                {debugInfo.estadisticas && (
                  <>
                    <div className="font-medium text-purple-700 mt-2">📈 ESTADÍSTICAS BD:</div>
                    <div>Total socios: {debugInfo.estadisticas.totalSocios || 0}</div>
                    <div>Total haberes: {debugInfo.estadisticas.totalHaberes || 0}</div>
                    <div>Total préstamos: {debugInfo.estadisticas.totalPrestamos || 0}</div>
                  </>
                )}

                {debugInfo.usuariosEjemplo && (
                  <div className="mt-2">
                    <div className="font-medium">👥 Usuarios de ejemplo:</div>
                    {debugInfo.usuariosEjemplo.map((user, i) => (
                      <div key={i} className="ml-2 text-xs">
                        - {user.CodSocio} - {user.NombreCompleto}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.socio) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">
          Error: No se pudieron cargar los datos del usuario.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <DashboardContent
          userData={dashboardData.socio}
          haberesData={dashboardData.haberes}
          prestamosData={dashboardData.prestamos || []}
          codSocio={dashboardData.socio.CodSocio}
        />
      </main>
    </div>
  );
}