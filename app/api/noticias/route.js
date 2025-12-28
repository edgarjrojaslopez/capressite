// app/api/noticias/route.js
export const runtime = 'nodejs'; // Fuerza el uso de Node.js Runtime
export const dynamic = 'force-dynamic'; // Desactiva la caché

import { db } from '@/lib/db';
import { noticias } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// GET: Obtener todas las noticias
export async function GET() {
  try {
    const allNoticias = await db
      .select()
      .from(noticias)
      .orderBy(noticias.fechaCreacion, 'desc');
    return NextResponse.json(allNoticias);
  } catch (error) {
    console.error('Error al obtener las noticias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva noticia
export async function POST(req) {
  try {
    const { titulo, resumen, contenido, imagenUrl } = await req.json();

    if (!titulo || !contenido) {
      return NextResponse.json(
        { error: 'El título y el contenido son obligatorios' },
        { status: 400 }
      );
    }

    const nuevaNoticia = {
      id: uuidv4(),
      titulo,
      resumen,
      contenido,
      imagenUrl,
      fechaCreacion: new Date(),
    };

    await db.insert(noticias).values(nuevaNoticia);

    return NextResponse.json(nuevaNoticia, { status: 201 });
  } catch (error) {
    console.error('Error al crear la noticia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
