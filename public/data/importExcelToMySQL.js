// scripts/importExcelToMySQL.js
const XLSX = require('xlsx');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const { parseISO, format } = require('date-fns');

// Configuración de la conexión a MySQL
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'C4pr3s01*',
  database: 'capres_web',
});

// Función para limpiar valores
function cleanValue(value) {
  if (value === undefined || value === '') {
    return null;
  }
  return value;
}

// Función para formatear fechas
function formatDate(date) {
  const cleaned = cleanValue(date);
  if (cleaned === null) return null;

  let dateString = cleaned.toString(); // Aseguramos que sea string

  // Caso 1: Si es un número (como 42639), es una fecha serial de Excel
  if (!isNaN(Number(dateString)) && dateString.includes('/') === false) {
    const excelSerial = Number(dateString);
    const baseDate = new Date(1899, 11, 30); // Fecha base de Excel
    const dateObj = new Date(
      baseDate.getTime() + excelSerial * 24 * 60 * 60 * 1000
    );
    return dateObj.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  // Caso 2: Formato DD/MM/YYYY o DD-MM-YYYY
  if (dateString.includes('/') || dateString.includes('-')) {
    const [day, month, year] = dateString.split(/[/\-]/);

    // Validamos que sean números
    if (!day || !month || !year) return null;

    const parsedDate = new Date(
      `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    );
    if (isNaN(parsedDate.getTime())) return null;

    return parsedDate.toISOString().split('T')[0];
  }

  // Caso 3: Ya está en formato ISO (YYYY-MM-DD)
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) {
    return isoDate.toISOString().split('T')[0];
  }

  return null;
}

async function importExcelToMySQL() {
  try {
    // Lee el archivo Excel
    const filePath = path.resolve(__dirname, './socios_nuevo.xlsx');

    if (!fs.existsSync(filePath)) {
      throw new Error(`El archivo no existe en la ruta: ${filePath}`);
    }

    const file = XLSX.readFile(filePath);
    const sheetName = file.SheetNames[0];
    const sheet = file.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Conecta a la base de datos
    const db = await connection.getConnection();

    // Inserta cada fila en la tabla socios
    for (const row of jsonData) {
      const {
        CodSocio,
        NombreCompleto,
        NroCtaBanco,
        Estatus,
        FechaIng,
        PorAporteS,
        PorAporteP,
        SaldoInicial,
        SaldoActual,
        FecUltimoPrestamo,
        Estado,
        Telefonos,
        FechaEgreso,
        FechaRegistro,
        Email,
      } = row;

      const formattedFechaIng = formatDate(FechaIng);
      const formattedFecUltimoPrestamo = formatDate(FecUltimoPrestamo);
      const formattedFechaEgreso = formatDate(FechaEgreso);
      const formattedFechaRegistro = formatDate(FechaRegistro);

      await db.execute(
        `INSERT INTO socios (
          CodSocio, NombreCompleto, NroCtaBanco, Estatus, FechaIng, PorAporteS, PorAporteP,
          SaldoInicial, SaldoActual, FecUltimoPrestamo, Estado, Telefonos, FechaEgreso, FechaRegistro, Email
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cleanValue(CodSocio),
          cleanValue(NombreCompleto),
          cleanValue(NroCtaBanco),
          cleanValue(Estatus),
          cleanValue(formattedFechaIng),
          cleanValue(PorAporteS),
          cleanValue(PorAporteP),
          cleanValue(SaldoInicial),
          cleanValue(SaldoActual),
          cleanValue(formattedFecUltimoPrestamo),
          cleanValue(Estado),
          cleanValue(Telefonos),
          cleanValue(formattedFechaEgreso),
          cleanValue(formattedFechaRegistro),
          cleanValue(Email),
        ]
      );
    }

    console.log('✅ Datos importados correctamente.');
  } catch (error) {
    console.error('❌ Error al importar datos:', error.message);
  } finally {
    if (connection) connection.end();
  }
}

importExcelToMySQL();
