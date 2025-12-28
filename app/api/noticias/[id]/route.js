// app/api/noticias/[id]/route.js
import { db } from '@/lib/db';
import { noticias } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET: Obtener una noticia por ID
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const noticia = await db.select().from(noticias).where(eq(noticias.id, id));

    if (noticia.length === 0) {
      return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
    }

    return NextResponse.json(noticia[0]);
  } catch (error) {
    console.error(`Error al obtener la noticia ${params.id}:`, error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT: Actualizar una noticia
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { titulo, resumen, contenido, imagenUrl } = await req.json();

    if (!titulo || !contenido) {
      return NextResponse.json({ error: 'El título y el contenido son obligatorios' }, { status: 400 });
    }

    const updatedNoticia = {
      titulo,
      resumen,
      contenido,
      imagenUrl,
    };

    await db.update(noticias).set(updatedNoticia).where(eq(noticias.id, id));

    return NextResponse.json(updatedNoticia);
  } catch (error) {
    console.error(`Error al actualizar la noticia ${params.id}:`, error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE: Eliminar una noticia
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await db.delete(noticias).where(eq(noticias.id, id));

    return NextResponse.json({ message: 'Noticia eliminada correctamente' }, { status: 200 });
  } catch (error) {
    console.error(`Error al eliminar la noticia ${params.id}:`, error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}