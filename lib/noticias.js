// lib/noticias.js

const NOTICIAS_FILE = 'data/noticias.json';

// Reutiliza fetch para cargar el JSON
async function cargarNoticias() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${NOTICIAS_FILE}`
  );
  if (!res.ok) throw new Error('No se pudo cargar las noticias');
  return res.json();
}

// Exporta una función para obtener una noticia por ID
export async function noticiaPorId(id) {
  try {
    const noticias = await cargarNoticias();
    return noticias.find((n) => n.id.toString() === id.toString()) || null;
  } catch (error) {
    console.error('Error al cargar noticia por ID:', error);
    return null;
  }
}

// Opcional: exportar todas si necesitas en otra página
export async function todasLasNoticias() {
  try {
    return await cargarNoticias();
  } catch (error) {
    console.error('Error al cargar todas las noticias:', error);
    return [];
  }
}
