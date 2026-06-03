// lib/db/connect.js
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde .env.local para scripts externos y herramientas de CLI
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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
