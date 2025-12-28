// app/api/upload/route.js
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json(
      { error: 'No se proporcionó archivo' },
      { status: 400 }
    );
  }

  // Convertir el archivo a un buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Crear un nombre de archivo único para evitar sobreescrituras
  const fileName = `${Date.now()}-${file.name}`;
  
  // Definir la ruta donde se guardará el archivo
  // process.cwd() es la raíz del proyecto
  const filePath = path.join(process.cwd(), 'public', 'images', fileName);

  try {
    // Escribir el archivo en el sistema de archivos
    await writeFile(filePath, buffer);

    // Devolver la URL pública del archivo
    const publicUrl = `/images/${fileName}`;
    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error('Error al guardar el archivo:', error);
    return NextResponse.json(
      { error: 'Error al guardar el archivo en el servidor' },
      { status: 500 }
    );
  }
}