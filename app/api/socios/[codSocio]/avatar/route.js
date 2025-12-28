

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { writeFile } from 'fs/promises';
import path from 'path';

// Validación de autorización
async function checkAuth(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return { authorized: false, error: 'No autorizado' };
  }
  // TODO: Implementa validación real si es necesario.
  return { authorized: true };
}

export async function PUT(request, { params }) {
  const { codSocio } = params;

  // Verificar autorización
  const auth = await checkAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('avatar');

    if (!file) {
      return NextResponse.json(
        { error: 'No se subió ningún archivo.' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen.' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Generar un nombre de archivo único
    const ext = path.extname(file.name) || '.png';
    const fileName = `avatar-${codSocio}-${Date.now()}${ext}`;

    // Ruta de guardado en public/images
    const savePath = path.join(process.cwd(), 'public', 'images', fileName);

    // Guardar el archivo
    await writeFile(savePath, fileBuffer);

    // URL pública para acceder al archivo
    const avatarUrl = `/images/${fileName}`;

    // Actualizar en la base de datos
    const result = await db
      .update(socios)
      .set({ avatar: avatarUrl })
      .where(eq(socios.CodSocio, codSocio));

    if (result.rowsAffected === 0) {
      // Si el socio no se encuentra, se podría borrar el archivo subido para no dejar basura
      // await unlink(savePath); // (Opcional)
      return NextResponse.json(
        { error: 'Socio no encontrado.' },
        { status: 404 }
      );
    }

    // Responder con éxito
    return NextResponse.json({
      avatarUrl,
      message: 'Avatar actualizado correctamente',
    });
  } catch (error) {
    console.error('Error en /api/socios/[codSocio]/avatar:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}
