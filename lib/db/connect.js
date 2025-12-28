// lib/db/connect.js
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 10000,
  debug: false, // Deshabilitado para evitar logs de bajo nivel de MySQL2
  ssl: false, // Deshabilitar SSL completamente
});

// Verificación de conexión
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos establecida con éxito');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
  }
}

// Verificar la conexión al inicio
checkConnection();

// Verificar periódicamente
setInterval(checkConnection, 60000);

export const db = drizzle(pool, {
  logger: process.env.NODE_ENV === 'development'
    ? {
        logQuery: (query, params) => {
          console.log('Query:', query);
          if (params && params.length > 0) {
            console.log('Params:', params);
          }
        }
      }
    : false
});
