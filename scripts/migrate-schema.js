import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import mysql from 'mysql2/promise';

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    console.log('🔵 Iniciando migración del schema...\n');

    // Agregar columnas faltantes a la tabla socios
    const columns = [
      { name: 'Frecuencia', def: 'VARCHAR(1)' },
      { name: 'CodigoTN', def: 'VARCHAR(2)' },
      { name: 'Organismo', def: 'VARCHAR(2)' },
      { name: 'CodInterno', def: 'VARCHAR(10)' },
      { name: 'FechaUltRecPago', def: 'DATETIME' },
      { name: 'MtoUltRecPago', def: 'DECIMAL(10,2)' },
      { name: 'UltimaModificacion', def: 'DATETIME' },
      { name: 'CodCargo', def: 'VARCHAR(2)' },
      { name: 'Usuario', def: 'VARCHAR(4)' },
      { name: 'Pcname', def: 'VARCHAR(20)' },
    ];

    for (const col of columns) {
      try {
        await pool.execute(
          `ALTER TABLE socios ADD COLUMN \`${col.name}\` ${col.def} DEFAULT NULL`
        );
        console.log(`✅ Columna ${col.name} agregada`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`⏭️  Columna ${col.name} ya existe`);
        } else {
          throw err;
        }
      }
    }

    // Agregar foreign key a prestamos si no existe
    try {
      await pool.execute(
        `ALTER TABLE prestamos ADD CONSTRAINT fk_prestamos_socios FOREIGN KEY (codSocio) REFERENCES socios(CodSocio) ON DELETE CASCADE`
      );
      console.log('✅ FK fk_prestamos_socios agregada');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('⏭️  FK fk_prestamos_socios ya existe');
      } else {
        throw err;
      }
    }

    console.log('\n✅ Migración completada exitosamente.');
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    await pool.end();
  }
}

migrate();
