// /lib/api/error.js

class ApiError extends Error {
  constructor(message, { code = 'INTERNAL_ERROR', status = 500 } = {}) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function handleError(error) {
  // 🔥 Muestra el error real en la consola del servidor
  console.error('❌ Error no manejado:', error);
  console.error('❌ Tipo de error:', error.name);
  console.error('❌ Mensaje:', error.message);
  console.error('❌ Stack:', error.stack);

  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      }),
      {
        status: error.status,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // ✅ Devuelve más detalles en desarrollo
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        message: 'Ocurrió un error inesperado.',
        code: 'UNEXPECTED_ERROR',
        // 👇 Solo en desarrollo: muestra el mensaje real
        devMessage:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
        devStack:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export { ApiError, handleError };
