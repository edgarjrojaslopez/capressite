// app/noticia/[id]/page.jsx
import { db } from '@/lib/db';
import { noticias } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Función para formatear la fecha
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  const date = new Date(dateString);

  // Si la fecha sigue siendo inválida por alguna razón, muestra un texto alternativo.
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  return new Intl.DateTimeFormat('es-VE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Caracas', // Asegura la consistencia entre servidor y cliente
  }).format(date);
};

// Esta función se ejecuta en el servidor para obtener los datos de la noticia
async function getNoticia(id) {
  try {
    const [noticia] = await db
      .select()
      .from(noticias)
      .where(eq(noticias.id, id))
      .limit(1);

    return noticia;
  } catch (error) {
    console.error('Error al obtener la noticia:', error);
    return null;
  }
}

export default async function NoticiaPage({ params }) {
  const { id } = params;
  const noticia = await getNoticia(id);

  // Si la noticia no se encuentra, muestra la página 404
  if (!noticia) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {noticia.titulo}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Publicado el {formatDate(noticia.fechaCreacion)}
        </p>

        {noticia.imagenUrl && (
          <div className="relative w-full h-64 sm:h-96 mb-8 rounded-lg overflow-hidden">
            <img
              src={noticia.imagenUrl}
              alt={`Imagen para ${noticia.titulo}`}
              layout="fill"
              objectfit="cover"
              className="w-full h-64 object-cover rounded-2xl mb-6"
            />
          </div>
        )}

        {/* El contenido de la noticia se renderiza de forma segura */}
        <div
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: noticia.contenido }}
        />
      </article>
    </div>
  );
}
