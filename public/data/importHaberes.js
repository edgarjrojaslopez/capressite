// scripts/importHaberes.js
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Configuración de la conexión a MySQL
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root', // Cambia esto
  password: 'C4pr3s01*', // Cambia esto
  database: 'capres_web', // Cambia esto
});

// Función para limpiar valores
function cleanValue(value) {
  if (value === undefined || value === '' || value === '\\N') {
    return null;
  }
  return value.trim();
}

// Función para convertir decimal con coma a número
function parseDecimal(value) {
  const cleaned = cleanValue(value);
  if (cleaned === null) return null;
  const numberStr = cleaned.replace(',', '.');
  return parseFloat(numberStr);
}

// Función para limpiar cédula (quitar ceros iniciales)
function cleanCodSocio(cod) {
  const cleaned = cleanValue(cod);
  if (cleaned === null) return null;
  return cleaned.replace(/^0+/, '') || '0'; // Quita ceros iniciales
}

async function importHaberes() {
  try {
    const filePath = path.resolve(__dirname, './haberes.txt');

    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ El archivo no existe en: ${filePath}`);
    }

    console.log('✅ Leyendo archivo haberes.txt...');
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');

    console.log(`✅ Se encontraron ${lines.length} filas`);

    const db = await connection.getConnection();

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Salta líneas vacías

      try {
        const fields = line.split(';').map((field) => cleanValue(field));

        if (fields.length !== 6) {
          console.warn(
            `⚠️ Fila ${i + 1} tiene ${fields.length} campos, se esperaban 6`
          );
          continue;
        }

        const [rawCodSocio, aporteS, aporteP, aporteV, retiroH, totalH] =
          fields;

        const codSocio = cleanCodSocio(rawCodSocio);
        const parsedAporteS = parseDecimal(aporteS);
        const parsedAporteP = parseDecimal(aporteP);
        const parsedAporteV = parseDecimal(aporteV);
        const parsedRetiroH = parseDecimal(retiroH);
        const parsedTotalH = parseDecimal(totalH);

        // Verifica que el codSocio exista en la tabla socios
        const [exists] = await db.execute(
          'SELECT CodSocio FROM socios WHERE CodSocio = ?',
          [codSocio]
        );

        if (exists.length === 0) {
          console.warn(
            `⚠️ Socio con codSocio ${codSocio} no existe en la tabla socios`
          );
          continue;
        }

        // Inserta en la tabla haberes
        await db.execute(
          `INSERT INTO haberes (codSocio, aporteS, aporteP, aporteV, retiroH, totalH)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             aporteS = VALUES(aporteS),
             aporteP = VALUES(aporteP),
             aporteV = VALUES(aporteV),
             retiroH = VALUES(retiroH),
             totalH = VALUES(totalH)`,
          [
            codSocio,
            parsedAporteS,
            parsedAporteP,
            parsedAporteV,
            parsedRetiroH,
            parsedTotalH,
          ]
        );

        successCount++;
      } catch (rowError) {
        console.error(`❌ Error en fila ${i + 1}:`, rowError.message);
        errorCount++;
      }
    }

    console.log(
      `✅ Importación finalizada: ${successCount} insertados/actualizados, ${errorCount} errores.`
    );
  } catch (error) {
    console.error('❌ Error general al importar haberes:', error.message);
  } finally {
    if (connection) connection.end();
  }
}

importHaberes();
