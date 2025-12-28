// scripts/importData.js

// PASO 1: Cargar las variables de entorno. ESTO DEBE SER LO PRIMERO.
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// PASO 2: Ahora sí, importar el resto de los módulos.
import fs from 'fs';
import { db } from '../lib/db/index.js';
import { socios, haberes, prestamos } from '../lib/db/schema.js';
import { randomUUID } from 'crypto';

// --- CONFIGURACIÓN ---
const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const HABERES_FILE = path.join(DATA_DIR, 'HABERES.TXT');
const PRESTAMOS_FILE = path.join(DATA_DIR, 'PRESTAMOS.TXT');

// --- FUNCIONES DE PARSEO ---
const parseCurrency = (str) => {
  if (!str) return 0;
  return parseFloat(str.trim().replace(/\./g, '').replace(',', '.'));
};

const parseDate = (str) => {
  if (!str) return null;
  const [day, month, year] = str.trim().split('/');
  if (!day || !month || !year) return null;
  return new Date(`20${year}-${month}-${day}`);
};

// --- LÓGICA PRINCIPAL ---
async function importData() {
  console.log('🔵 Iniciando el proceso de importación...');

  if (!fs.existsSync(HABERES_FILE) || !fs.existsSync(PRESTAMOS_FILE)) {
    console.error(`❌ Error: No se encontraron los archivos de datos en la carpeta ${DATA_DIR}`);
    process.exit(1);
  }

  console.log('🔄 Cargando socios existentes desde la base de datos...');
  const existingSocios = await db.select({ codSocio: socios.CodSocio }).from(socios);
  const validSocioCodes = new Set(existingSocios.map((s) => s.codSocio));
  console.log(`✅ Encontrados ${validSocioCodes.size} socios válidos.`);

  const haberesFileContent = fs.readFileSync(HABERES_FILE, 'utf-8');
  const haberesToInsert = [];
  const rejectedHaberes = [];

  haberesFileContent.split(/\r?\n/).forEach((line) => {
    if (!line.trim()) return;
    const [codSocio, aporteS, aporteP, aporteV, retiroH, totalH] = line.split(';');
    if (validSocioCodes.has(codSocio.trim())) {
      haberesToInsert.push({
        codSocio: codSocio.trim(),
        aporteS: parseCurrency(aporteS),
        aporteP: parseCurrency(aporteP),
        aporteV: parseCurrency(aporteV),
        retiroH: parseCurrency(retiroH),
        totalH: parseCurrency(totalH),
      });
    } else if (codSocio && codSocio.trim()) {
      rejectedHaberes.push(codSocio.trim());
    }
  });

  const prestamosFileContent = fs.readFileSync(PRESTAMOS_FILE, 'utf-8');
  const prestamosToInsert = [];
  const rejectedPrestamos = [];

  prestamosFileContent.split(/\r?\n/).forEach((line) => {
    if (!line.trim()) return;
    const [codSocio, tipoPrest, fechaPrest, montoPrest, saldoPrest] = line.split(';');
    if (validSocioCodes.has(codSocio.trim())) {
      prestamosToInsert.push({
        id: randomUUID(),
        codSocio: codSocio.trim(),
        tipoPrest: tipoPrest.trim(),
        fechaPrest: parseDate(fechaPrest),
        montoPrest: parseCurrency(montoPrest),
        saldoPrest: parseCurrency(saldoPrest),
      });
    } else if (codSocio && codSocio.trim()) {
      rejectedPrestamos.push(codSocio.trim());
    }
  });

  console.log('📊 Datos de los archivos procesados.');
  console.log(`  - Haberes a insertar: ${haberesToInsert.length}`);
  console.log(`  - Préstamos a insertar: ${prestamosToInsert.length}`);

  if (rejectedHaberes.length > 0 || rejectedPrestamos.length > 0) {
    console.warn('⚠️ ATENCIÓN: Se encontraron registros de socios que no existen en la BD.');
    if (rejectedHaberes.length > 0) {
      console.warn(`  - Socios no encontrados en HABERES.TXT: ${[...new Set(rejectedHaberes)].join(', ')}`);
    }
    if (rejectedPrestamos.length > 0) {
      console.warn(`  - Socios no encontrados en PRESTAMOS.TXT: ${[...new Set(rejectedPrestamos)].join(', ')}`);
    }
    console.log('Estos registros serán ignorados. Continúando con la importación...');
  }

  if (haberesToInsert.length === 0 && prestamosToInsert.length === 0) {
    console.log('🤷 No hay datos válidos para importar. Proceso terminado.');
    return;
  }

  try {
    console.log('🔄 Ejecutando transacción en la base de datos...');
    await db.transaction(async (tx) => {
      console.log('  - Limpiando tabla de haberes...');
      await tx.delete(haberes);
      console.log('  - Limpiando tabla de prestamos...');
      await tx.delete(prestamos);
      if (haberesToInsert.length > 0) {
        console.log(`  - Insertando ${haberesToInsert.length} registros en haberes...`);
        await tx.insert(haberes).values(haberesToInsert);
      }
      if (prestamosToInsert.length > 0) {
        console.log(`  - Insertando ${prestamosToInsert.length} registros en prestamos...`);
        await tx.insert(prestamos).values(prestamosToInsert);
      }
    });
    console.log('✅ ¡Éxito! La importación se completó correctamente.');
  } catch (error) {
    console.error('❌ Error catastrófico durante la transacción:', error);
    console.error('La base de datos ha sido restaurada a su estado anterior a la importación.');
    process.exit(1);
  }
}

importData().catch((error) => {
  console.error('❌ Ocurrió un error inesperado en el script:', error);
  process.exit(1);
});