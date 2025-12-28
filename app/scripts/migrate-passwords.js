// scripts/migrate-passwords.js

import 'dotenv/config';
import { db, socios } from '../../lib/db/index.js';
import bcrypt from 'bcryptjs';
import { eq, like } from 'drizzle-orm';

const SALT_ROUNDS = 10;

async function migratePasswords() {
  try {
    // Obtener todos los socios con contraseña en texto plano
    const sociosConPassword = await db
      .select()
      .from(socios)
      .where(like(socios.password, 'password%')); // Ajusta si es necesario

    if (sociosConPassword.length === 0) {
      console.log('✅ No hay contraseñas en texto plano para migrar.');
      return;
    }

    for (const socio of sociosConPassword) {
      const hashed = await bcrypt.hash('password123', SALT_ROUNDS);
      await db
        .update(socios)
        .set({ password: hashed })
        .where(eq(socios.CodSocio, socio.CodSocio));

      console.log(`✅ Contraseña hasheada para socio: ${socio.CodSocio}`);
    }

    console.log('✅ Migración de contraseñas completada');
  } catch (error) {
    console.error('❌ Error al migrar contraseñas:', error);
  } finally {
    process.exit();
  }
}

migratePasswords();
