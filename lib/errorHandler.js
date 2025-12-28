// lib/errorHandler.js
export class AuthError extends Error {
    constructor(message, statusCode = 400) {
      super(message);
      this.name = 'AuthError';
      this.statusCode = statusCode;
    }
  }

  export function handleApiError(error) {
    console.error('Error en la API:', error);

    if (error instanceof AuthError) {
      return new Response(
        JSON.stringify({ error: { message: error.message } }),
        { status: error.statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // No exponer detalles del error en producción
    const message = process.env.NODE_ENV === 'development'
      ? error.message
      : 'Ocurrió un error en el servidor';

    return new Response(
      JSON.stringify({ error: { message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }