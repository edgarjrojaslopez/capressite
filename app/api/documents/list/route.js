import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const baseDirectory = path.join(process.cwd(), 'public/assets/files');

    // Definir las categorías y sus nombres descriptivos
    const categories = {
      marco_legal: {
        folder: 'marco_legal',
        documents: {
          'ley_de_cajas_de_ahorro.pdf': 'Ley de Cajas de Ahorro',
          'estatutos.pdf': 'Estatuto de la Caja de Ahorros'
        }
      },
      operaciones: {
        folder: 'operaciones',
        documents: {
          'afiliacion.pdf': 'Solicitud de Afiliación',
          'cambio_porcentaje.pdf': 'Cambio de Porcentaje de Aporte',
          'prestamos.pdf': 'Formulario de Solicitud de Préstamo',
          'retiro_hab_parcial.pdf': 'Retiro de Haberes Parcial',
          'retiro_hab_total.pdf': 'Retiro de Haberes Total'
        }
      }
    };

    const result = {
      marcoLegal: [],
      operaciones: []
    };

    // Función para formatear el tamaño del archivo
    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // Procesar Marco Legal
    const marcoLegalPath = path.join(baseDirectory, categories.marco_legal.folder);
    if (fs.existsSync(marcoLegalPath)) {
      const files = fs.readdirSync(marcoLegalPath);
      const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

      result.marcoLegal = pdfFiles.map(filename => {
        const filePath = path.join(marcoLegalPath, filename);
        const stats = fs.statSync(filePath);

        return {
          filename,
          name: categories.marco_legal.documents[filename] || filename.replace('.pdf', ''),
          size: formatSize(stats.size),
          type: 'PDF'
        };
      });
    }

    // Procesar Operaciones
    const operacionesPath = path.join(baseDirectory, categories.operaciones.folder);
    if (fs.existsSync(operacionesPath)) {
      const files = fs.readdirSync(operacionesPath);
      const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

      result.operaciones = pdfFiles.map(filename => {
        const filePath = path.join(operacionesPath, filename);
        const stats = fs.statSync(filePath);

        return {
          filename,
          name: categories.operaciones.documents[filename] || filename.replace('.pdf', ''),
          size: formatSize(stats.size),
          type: 'PDF'
        };
      });
    }

    return NextResponse.json({ documents: result });
  } catch (error) {
    console.error('Error listando documentos:', error);
    return NextResponse.json({
      documents: { marcoLegal: [], operaciones: [] }
    }, { status: 500 });
  }
}