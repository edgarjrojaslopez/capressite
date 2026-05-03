// scripts/actualizar-socios.js
// Script para actualizar la tabla 'socios' desde el archivo SOCIOS.txt
// Solo se procesan los registros con Estatus = "A" (activos)

// IMPORTANTE: Cargar dotenv PRIMERO, antes de cualquier importación de la BD
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import fs from 'fs';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { socios } from '../lib/db/schema.js';
import { eq } from 'drizzle-orm';

// Crear conexión directa usando las variables de entorno
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

const db = drizzle(pool);

// --- CONFIGURACIÓN ---
const SOCIOS_FILE = path.join(process.cwd(), 'public', 'data', 'SOCIOS.txt');

// --- FUNCIONES DE PARSEO ---
const parseField = (str) => {
  if (!str || str === 'NULL' || str.trim() === '') return null;
  return str.replace(/^"|"$/g, '').trim();
};

const parseDate = (str) => {
  const value = parseField(str);
  if (!value) return null;
  // El formato en el archivo es "YYYY-MM-DD HH:MM:SS"
  const datePart = value.split(' ')[0];
  return datePart;
};

const parseBoolean = (str) => {
  const value = parseField(str);
  if (value === null) return null;
  return parseInt(value, 10) === 1;
};

const parseDecimal = (str) => {
  const value = parseField(str);
  if (value === null) return null;
  const num = parseFloat(value.replace(',', '.'));
  return isNaN(num) ? null : num.toString();
};

// --- LÓGICA PRINCIPAL ---
async function actualizarSocios() {
  console.log('🔵 Iniciando el proceso de actualización de socios activos...');
  console.log(`📁 Archivo de origen: ${SOCIOS_FILE}`);

  if (!fs.existsSync(SOCIOS_FILE)) {
    console.error(`❌ Error: No se encontró el archivo ${SOCIOS_FILE}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(SOCIOS_FILE, 'utf-8');
  const lines = fileContent.split(/\r?\n/);

  // La primera línea es el encabezado
  const header = lines[0].split(';').map(h => h.replace(/^"|"$/g, '').trim());
  console.log(`📋 Campos encontrados: ${header.join(', ')}`);

  const registrosProcesados = [];
  const registrosInsertados = [];
  const registrosActualizados = [];
  const registrosFallidos = [];
  const registrosInactivos = [];

  // Procesar cada línea (empezando desde la línea 1 para saltar el encabezado)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(';').map(v => v.replace(/^"|"$/g, '').trim());

    // Crear objeto con los campos
    const record = {};
    header.forEach((field, index) => {
      record[field] = values[index] || null;
    });

    // Verificar si el estatus es "A" (activo)
    if (record.Estatus !== 'A') {
      registrosInactivos.push(record.CodSocio);
      continue;
    }

    registrosProcesados.push(record.CodSocio);

    // Mapear los campos del archivo a la estructura de la base de datos
    const socioData = {
      CodSocio: parseField(record.CodSocio),
      NombreCompleto: parseField(record.NombreCompleto),
      NroCtaBanco: parseField(record.NroCtaBanco),
      Estatus: parseField(record.Estatus),
      FechaIng: parseDate(record.FechaIngreso),
      PorAporteS: parseDecimal(record.PorAporteS),
      PorAporteP: parseDecimal(record.PorAporteP),
      SaldoInicial: parseDecimal(record.SaldoInicial),
      SaldoActual: parseDecimal(record.SaldoActual),
      FecUltimoPrestamo: parseDate(record.FecUltimoPrestamo),
      Estado: parseBoolean(record.Estado),
      Telefonos: parseField(record.Telefonos),
      FechaEgreso: parseDate(record.FechaEgreso),
      FechaRegistro: parseDate(record.FechaRegistro),
      Email: parseField(record.Email),
    };

    try {
      // Verificar si el socio ya existe
      const existingSocio = await db
        .select()
        .from(socios)
        .where(eq(socios.CodSocio, socioData.CodSocio))
        .limit(1);

      if (existingSocio.length > 0) {
        // Actualizar registro existente
        await db
          .update(socios)
          .set(socioData)
          .where(eq(socios.CodSocio, socioData.CodSocio));
        registrosActualizados.push(socioData.CodSocio);
      } else {
        // Insertar nuevo registro
        await db.insert(socios).values(socioData);
        registrosInsertados.push(socioData.CodSocio);
      }
    } catch (error) {
      console.error(`❌ Error procesando socio ${socioData.CodSocio}: ${error.message}`);
      registrosFallidos.push({ codSocio: socioData.CodSocio, error: error.message });
    }
  }

  // Generar resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE LA OPERACIÓN');
  console.log('='.repeat(60));
  console.log(`📁 Archivo procesado: ${SOCIOS_FILE}`);
  console.log(`📅 Fecha de ejecución: ${new Date().toLocaleString('es-ES')}`);
  console.log('-'.repeat(60));
  console.log(`📋 Total de registros en el archivo: ${lines.length - 1}`); // -1 por el encabezado
  console.log(`✅ Total registros procesados (Estatus = "A"): ${registrosProcesados.length}`);
  console.log(`🆕 Nuevos socios insertados: ${registrosInsertados.length}`);
  console.log(`🔄 Socios actualizados: ${registrosActualizados.length}`);
  console.log(`⏭️  Socios omitidos (inactivos): ${registrosInactivos.length}`);
  console.log(`❌ Registros fallidos: ${registrosFallidos.length}`);
  console.log('-'.repeat(60));

  if (registrosInsertados.length > 0) {
    console.log('\n🆕 SOCIOS INSERTADOS:');
    registrosInsertados.forEach(cod => console.log(`   - ${cod}`));
  }

  if (registrosActualizados.length > 0) {
    console.log('\n🔄 SOCIOS ACTUALIZADOS:');
    registrosActualizados.slice(0, 20).forEach(cod => console.log(`   - ${cod}`));
    if (registrosActualizados.length > 20) {
      console.log(`   ... y ${registrosActualizados.length - 20} más`);
    }
  }

  if (registrosFallidos.length > 0) {
    console.log('\n❌ REGISTROS FALLIDOS:');
    registrosFallidos.forEach(({ codSocio, error }) => {
      console.log(`   - ${codSocio}: ${error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Proceso de actualización completado exitosamente.');
  console.log('='.repeat(60));

  // Guardar resumen en un archivo de log
  const logFile = path.join(process.cwd(), 'logs', `actualizar-socios-${Date.now()}.log`);
  const logDir = path.dirname(logFile);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const resumen = {
    fecha: new Date().toISOString(),
    archivoOrigen: SOCIOS_FILE,
    totalRegistrosArchivo: lines.length - 1,
    registrosProcesados: registrosProcesados.length,
    registrosInsertados: registrosInsertados.length,
    registrosActualizados: registrosActualizados.length,
    registrosInactivos: registrosInactivos.length,
    registrosFallidos: registrosFallidos.length,
    detalles: {
      insertados: registrosInsertados,
      actualizados: registrosActualizados,
      inactivos: registrosInactivos,
      fallidos: registrosFallidos,
    }
  };

  fs.writeFileSync(logFile, JSON.stringify(resumen, null, 2), 'utf-8');
  console.log(`\n📄 Resumen guardado en: ${logFile}`);

  // Cerrar la conexión
  await pool.end();
}

actualizarSocios().catch((error) => {
  console.error('❌ Ocurrió un error inesperado:', error);
  pool.end().finally(() => process.exit(1));
});
