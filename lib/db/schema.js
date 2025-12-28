// lib/db/schema.js

import {
  mysqlTableCreator,
  varchar,
  decimal,
  date,
  boolean,
  text,
  datetime,
  int,
  timestamp,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';

const mysqlTable = mysqlTableCreator((name) => name);

// --- TABLA DE SOCIOS ---
export const socios = mysqlTable('socios', {
  CodSocio: varchar('CodSocio', { length: 10 }).primaryKey(),
  avatar: varchar('avatar', { length: 255 }),
  NombreCompleto: varchar('NombreCompleto', { length: 255 }),
  NroCtaBanco: varchar('NroCtaBanco', { length: 20 }),
  Estatus: varchar('Estatus', { length: 1 }),
  FechaIng: date('FechaIng'),
  PorAporteS: decimal('PorAporteS', { precision: 10, scale: 2 }),
  PorAporteP: decimal('PorAporteP', { precision: 10, scale: 2 }),
  SaldoInicial: decimal('SaldoInicial', { precision: 10, scale: 2 }),
  SaldoActual: decimal('SaldoActual', { precision: 10, scale: 2 }),
  FecUltimoPrestamo: date('FecUltimoPrestamo'),
  Estado: boolean('Estado'),
  Telefonos: varchar('Telefonos', { length: 255 }),
  FechaEgreso: date('FechaEgreso'),
  FechaRegistro: date('FechaRegistro'),
  Email: varchar('Email', { length: 255 }),
  password: varchar('password', { length: 255 }),
  rol: mysqlEnum('rol', ['socio', 'admin']).default('socio').notNull(),
});

// --- TABLA DE HABERES ---
export const haberes = mysqlTable('haberes', {
  codSocio: varchar('codSocio', { length: 10 }).primaryKey().references(() => socios.CodSocio, { onDelete: 'cascade' }),
  aporteS: decimal('aporteS', { precision: 10, scale: 2 }),
  aporteP: decimal('aporteP', { precision: 10, scale: 2 }),
  aporteV: decimal('aporteV', { precision: 10, scale: 2 }),
  retiroH: decimal('retiroH', { precision: 10, scale: 2 }),
  totalH: decimal('totalH', { precision: 10, scale: 2 })
});

// --- TABLA DE PRESTAMOS ---
export const prestamos = mysqlTable('prestamos', {
  id: int('id').autoincrement().primaryKey(),
  codSocio: varchar('codSocio', { length: 10 }).notNull(),
  tipoPrest: varchar('tipoPrest', { length: 255 }),
  fechaPrest: date('fechaPrest'),
  montoPrest: decimal('montoPrest', { precision: 10, scale: 2 }),
  saldoPrest: decimal('saldoPrest', { precision: 10, scale: 2 }),
});

// --- TABLA DE SOLICITUDES DE PRÉSTAMO ---
export const solicitudes = mysqlTable('solicitudes', {
  id: int('id').autoincrement().primaryKey(),
  socioId: varchar('socioId', { length: 10 }).notNull(),
  nombreSocio: varchar('nombreSocio', { length: 100 }).notNull(),
  emailSocio: varchar('emailSocio', { length: 100 }),
  telefonoSocio: varchar('telefonoSocio', { length: 20 }),
  tipoPrestamo: varchar('tipoPrestamo', { length: 50 }).notNull(),
  montoSolicitado: decimal('montoSolicitado', {
    precision: 15,
    scale: 2,
  }).notNull(),
  razon: text('razon').notNull(),
  estado: mysqlEnum('estado', ['pendiente', 'aprobado', 'rechazado']).default(
    'pendiente'
  ),
  numeroSeguimiento: varchar('numeroSeguimiento', { length: 20 })
    .notNull()
    .unique(),
  createdAt: datetime('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updatedAt').default(
    sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
  ),
});

// --- TABLA DE SOLICITUDES DE RETIRO DE HABERES ---
export const solicitudes_haberes = mysqlTable('solicitudes_haberes', {
  id: int('id').autoincrement().primaryKey(),
  socioId: varchar('socioId', { length: 10 }).notNull(),
  nombreSocio: varchar('nombreSocio', { length: 100 }).notNull(),
  emailSocio: varchar('emailSocio', { length: 100 }),
  telefonoSocio: varchar('telefonoSocio', { length: 20 }),
  tipoRetiro: mysqlEnum('tipoRetiro', ['parcial', 'total']).notNull(),
  montoSolicitado: decimal('montoSolicitado', {
    precision: 15,
    scale: 2,
  }).notNull(),
  razon: text('razon').notNull(),
  estado: mysqlEnum('estado', ['pendiente', 'aprobado', 'rechazado']).default(
    'pendiente'
  ),
  numeroSeguimiento: varchar('numeroSeguimiento', { length: 20 })
    .notNull()
    .unique(),
  createdAt: datetime('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updatedAt').default(
    sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
  ),
});

// --- TABLA DE RETIROS DE HABERES ---
export const retirosHaberes = mysqlTable('retiros_haberes', {
  // Clave Primaria
  NroRetiro: int('NroRetiro', { unsigned: false }).notNull().primaryKey(),

  // Clave Foránea (se asume que CodSocio será VARCHAR en la tabla 'socios')
  // NOTA: Lo mantengo como INT (o VARCHAR) según la última discusión.
  // Si deseas que coincida con 'socios' (VARCHAR), cambia 'int' por 'varchar'
  CodSocio: int('CodSocio', { unsigned: false }).notNull(),

  CodInterno: varchar('CodInterno', { length: 8 }).notNull(),

  // Columna DATETIME
  FecRetiro: datetime('FecRetiro').notNull().default(sql`CURRENT_TIMESTAMP`),

  MontoRetiro: decimal('MontoRetiro', { precision: 15, scale: 2 }).notNull(),
  CodigoTipoRetiro: varchar('CodigoTipoRetiro', { length: 2 }).notNull(),
  CodigoMotivo: varchar('CodigoMotivo', { length: 2 }).notNull(),
  Cancelado: varchar('Cancelado', { length: 1 }).notNull(),
  CodBanco: int('CodBanco').notNull(),
  NroCheque: varchar('NroCheque', { length: 12 }).notNull(),
  MontoCheque: decimal('MontoCheque', { precision: 15, scale: 2 }).notNull(),
  Asiento: varchar('Asiento', { length: 1 }).notNull(),

  // Columna DATETIME
  FechaCheque: datetime('FechaCheque').notNull(),

  Anulado: varchar('Anulado', { length: 1 }).notNull(),

  // Columna DATETIME
  FecAnulacion: datetime('FecAnulacion').notNull(),

  MontoRetiroAS: decimal('MontoRetiroAS', { precision: 15, scale: 2 }).notNull(),
  MontoRetiroAP: decimal('MontoRetiroAP', { precision: 15, scale: 2 }).notNull(),
  MontoRetiroAV: decimal('MontoRetiroAV', { precision: 15, scale: 2 }).notNull(),
  InteresDevuelto: decimal('InteresDevuelto', { precision: 15, scale: 2 }).notNull(),
  ClavePrestamo: int('ClavePrestamo').notNull(),
  ReintegroCuotasDemas: decimal('ReintegroCuotasDemas', { precision: 15, scale: 2 }).notNull(),
  MontoPrestamosACancelar: decimal('MontoPrestamosACancelar', { precision: 15, scale: 2 }).notNull(),
  FormaDePago: varchar('FormaDePago', { length: 2 }).notNull(),
  GastosAdm: decimal('GastosAdm', { precision: 15, scale: 2 }).notNull(),
  Junta: decimal('Junta', { precision: 15, scale: 2 }).notNull(),
  Pcname: varchar('Pcname', { length: 20 }).notNull(),
  Usuario: varchar('Usuario', { length: 4 }).notNull(),

  // Columna DATETIME
  FechaRegistro: datetime('FechaRegistro').notNull(),

  CODCONBANCO: varchar('CODCONBANCO', { length: 12 }).notNull(),

}, (table) => {
  return {
    // 🔑 Clave Primaria explícita
    pk: primaryKey({ columns: [table.NroRetiro], name: 'PRIMARY' }),

    // ⚡ Índice en CodSocio para optimizar búsquedas (según lo solicitado)
    codSocioIdx: index('cod_socio_idx').on(table.CodSocio),
  };
});

// --- TABLA DE USUARIOS ---
export const usuarios = mysqlTable('usuarios', {
  id: int('id').autoincrement().primaryKey(),
  cedula: varchar('cedula', { length: 10 }).notNull().unique(),
  correo: varchar('correo', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
});

// --- RELACIONES (FOREIGN KEYS) ---
// Esto le dice a Drizzle cómo se conectan las tablas.
export const sociosRelations = relations(socios, ({ one, many }) => ({
  haberes: one(haberes, {
    fields: [socios.CodSocio],
    references: [haberes.codSocio],
  }),
  retiros: many(retirosHaberes, {
    fields: [socios.CodSocio],
    references: [retirosHaberes.CodSocio],
  }),
  prestamos: many(prestamos),
  retiroHaber: one(retirosHaberes, {
    fields: [socios.CodSocio],
    references: [retirosHaberes.CodSocio],
  }),
  usuario: one(usuarios, {
    fields: [socios.CodSocio],
    references: [usuarios.cedula],
  }),
}));

export const haberesRelations = relations(haberes, ({ one, many }) => ({
  socio: one(socios, {
    fields: [haberes.codSocio],
    references: [socios.CodSocio],
  }),
  retiros: many(retirosHaberes),
}));

export const prestamosRelations = relations(prestamos, ({ one }) => ({
  socio: one(socios, {
    fields: [prestamos.codSocio],
    references: [socios.CodSocio],
  }),
}));

export const retirosHaberesRelations = relations(retirosHaberes, ({ one }) => ({
  socio: one(socios, {
    fields: [retirosHaberes.CodSocio],
    references: [socios.CodSocio],
  }),
}));

export const solicitudes_haberesRelations = relations(solicitudes_haberes, ({ one }) => ({
  socio: one(socios, {
    fields: [solicitudes_haberes.socioId],
    references: [socios.CodSocio],
  }),
  retiro: one(retirosHaberes, {
    fields: [solicitudes_haberes.id],
    references: [retirosHaberes.solicitud_id],
  }),
}));

// --- OTRAS TABLAS (sin cambios) ---
export const passwordResetTokens = mysqlTable('passwordResetTokens', {
  id: int('id').autoincrement().primaryKey(),
  userId: varchar('userId', { length: 10 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expiresAt').notNull(),
  used: boolean('used').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const noticias = mysqlTable('noticias', {
  id: varchar('id', { length: 36 }).primaryKey(),
  titulo: varchar('titulo', { length: 255 }).notNull(),
  resumen: varchar('resumen', { length: 512 }),
  contenido: text('contenido'),
  imagenUrl: varchar('imagenUrl', { length: 255 }),
  fechaCreacion: datetime('fechaCreacion').notNull(),
});
