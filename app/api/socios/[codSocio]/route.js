export const runtime = 'nodejs';

import { withErrorHandler } from '@/lib/api/handler';
import { ApiError } from '@/lib/api/error';
import { db } from '@/lib/db';
import { socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth'; // Importar el helper de NextAuth

async function updateSocioHandler(req) {
  // 1. Obtener la sesión del usuario de forma segura
  const session = await auth();
  if (!session?.user?.id) {
    throw new ApiError('No autorizado', { status: 401 });
  }

  // 2. Obtener codSocio de la URL
  const url = new URL(req.url);
  const codSocio = url.pathname.split('/').pop();

  // 3. Verificar que el socio solo pueda editar sus propios datos
  // O que sea un administrador
  if (session.user.id !== codSocio && session.user.rol !== 'admin') {
    throw new ApiError('No autorizado para editar estos datos', { status: 403 });
  }

  // 4. Obtener y validar datos del body
  const { Telefonos, Email } = await req.json();

  const allowedFields = {};
  if (Telefonos !== undefined) allowedFields.Telefonos = Telefonos;
  if (Email !== undefined) allowedFields.Email = Email;

  if (Object.keys(allowedFields).length === 0) {
    throw new ApiError('No hay campos válidos para actualizar', { status: 400 });
  }

  // 5. Actualizar en la base de datos
  await db
    .update(socios)
    .set(allowedFields)
    .where(eq(socios.CodSocio, codSocio));

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Datos actualizados correctamente',
      updatedFields: allowedFields
    }),
    { status: 200 }
  );
}

export const PUT = withErrorHandler(updateSocioHandler);