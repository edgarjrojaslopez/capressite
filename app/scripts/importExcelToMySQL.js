// scripts/importExcelToMySQL.js
const XLSX = require('xlsx');
const mysql = require('mysql2/promise');

// Configuración de la conexión a MySQL
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'C4pr3s01*',
  database: 'capres_web',
});

async function importExcelToMySQL() {
  try {
    // Lee el archivo Excel
    const filePath = '../public/data/socios_nuevo.xlsx'; // Ruta relativa
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

      // Formatea las fechas
      const formattedFechaIng = new Date(FechaIng).toISOString().split('T')[0];
      const formattedFecUltimoPrestamo = FecUltimoPrestamo
        ? new Date(FecUltimoPrestamo).toISOString().split('T')[0]
        : null;
      const formattedFechaEgreso = FechaEgreso
        ? new Date(FechaEgreso).toISOString().split('T')[0]
        : null;
      const formattedFechaRegistro = FechaRegistro
        ? new Date(FechaRegistro).toISOString().split('T')[0]
        : null;

      // Inserta el registro en la base de datos
      await db.execute(
        `
          INSERT INTO socios (
            CodSocio, NombreCompleto, NroCtaBanco, Estatus, FechaIng, PorAporteS, PorAporteP,
            SaldoInicial, SaldoActual, FecUltimoPrestamo, Estado, Telefonos, FechaEgreso, FechaRegistro, Email
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          CodSocio,
          NombreCompleto,
          NroCtaBanco,
          Estatus,
          formattedFechaIng,
          PorAporteS,
          PorAporteP,
          SaldoInicial,
          SaldoActual,
          formattedFecUltimoPrestamo,
          Estado,
          Telefonos,
          formattedFechaEgreso,
          formattedFechaRegistro,
          Email,
        ]
      );
    }

    console.log('Datos importados correctamente.');
  } catch (error) {
    console.error('Error al importar datos:', error);
  } finally {
    if (connection) connection.end();
  }
}

importExcelToMySQL();
