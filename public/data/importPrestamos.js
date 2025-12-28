// scripts/importPrestamos.js
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
  return cleaned.replace(/^0+/, '') || '0';
}

// Función para convertir fecha DD/MM/YY a YYYY-MM-DD
function parseDate(dateStr) {
  const cleaned = cleanValue(dateStr);
  if (cleaned === null) return null;

  const match = cleaned.match(/(\d{2})\/(\d{2})\/(\d{2})/);
  if (!match) return null;

  const [, day, month, year] = match;
  const fullYear = `20${year}`; // Asumimos siglo XXI (2000-2099)
  const dateObj = new Date(`${fullYear}-${month}-${day}`);

  if (isNaN(dateObj.getTime())) return null;

  return dateObj.toISOString().split('T')[0];
}

async function importPrestamos() {
  try {
    const filePath = path.resolve(__dirname, './prestamos.txt');

    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ El archivo no existe en: ${filePath}`);
    }

    console.log('✅ Leyendo archivo prestamos.txt...');
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

        if (fields.length !== 5) {
          console.warn(
            `⚠️ Fila ${i + 1} tiene ${fields.length} campos, se esperaban 5`
          );
          continue;
        }

        const [rawCodSocio, tipoPrest, fechaPrest, montoPrest, saldoPrest] =
          fields;

        const codSocio = cleanCodSocio(rawCodSocio);
        const parsedTipoPrest = cleanValue(tipoPrest);
        const parsedFechaPrest = parseDate(fechaPrest);
        const parsedMontoPrest = parseDecimal(montoPrest);
        const parsedSaldoPrest = parseDecimal(saldoPrest);

        // Validar que el codSocio exista en la tabla socios
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

        // Insertar en la tabla prestamos
        await db.execute(
          `INSERT INTO prestamos (codSocio, tipoPrest, fechaPrest, montoPrest, saldoPrest)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             tipoPrest = VALUES(tipoPrest),
             fechaPrest = VALUES(fechaPrest),
             montoPrest = VALUES(montoPrest),
             saldoPrest = VALUES(saldoPrest)`,
          [
            codSocio,
            parsedTipoPrest,
            parsedFechaPrest,
            parsedMontoPrest,
            parsedSaldoPrest,
          ]
        );

        successCount++;
      } catch (rowError) {
        console.error(`❌ Error en fila ${i + 1}:`, rowError.message);
        errorCount++;
      }
    }

    console.log(
      `✅ Importación finalizada: ${successCount} préstamos insertados/actualizados, ${errorCount} errores.`
    );
  } catch (error) {
    console.error('❌ Error general al importar préstamos:', error.message);
  } finally {
    if (connection) connection.end();
  }
}

importPrestamos();
