

// db-connection-test.js
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const config = {
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

async function testConnection() {
  console.log('Intentando conectar a la base de datos con la siguiente configuración:');
  console.log({
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
    password: config.password ? '******' : '(not set)',
  });

  try {
    const connection = await mysql.createConnection(config);
    console.log('\n✅ ¡Conexión a la base de datos exitosa!');
    await connection.end();
    console.log('Conexión cerrada.');
  } catch (error) {
    console.error('\n❌ Error al conectar a la base de datos:');
    if (error.code === 'ECONNREFUSED') {
      console.error('Error: Conexión rechazada. Asegúrate de que el servidor de MySQL esté corriendo y accesible en el host y puerto especificados.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Error: Acceso denegado. Revisa que el usuario y la contraseña sean correctos.');
    } else {
      console.error('Error desconocido:', error.message);
    }
    console.error('Código de error:', error.code);
  }
}

testConnection();

