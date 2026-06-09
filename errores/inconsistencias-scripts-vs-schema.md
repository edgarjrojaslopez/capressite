# Inconsistencias entre `scripts/` y `lib/db/schema.js`

## 1. `scripts/importar_socios.js` no existe (referencia rota)

- **Archivo**: `package.json:9`
- **Referencia**: `"importar-socios": "node scripts/importar_socios.js"`
- **Problema**: El archivo `scripts/importar_socios.js` no existe. El archivo real es `scripts/actualizar-socios.js`.
- **Afecta**: El comando `npm run importar-socios` falla con "file not found".

---

## ~~2. `importData.js` — `TRUNCATE TABLE` dentro de transacción (bug)~~ (RESUELTO)

- **Archivo**: `scripts/importData.js:129` (eliminado)
- **Solución**: El archivo `importData.js` fue eliminado. El script vigente `runImport.js:137` usa `await tx.delete(prestamos)` que es DML y respeta la transacción correctamente.

---

## ~~3. `runImport.js` — `parseDate` devuelve `Date` object vs columna `date`~~ (DESCARTADO)

- **Archivo**: `scripts/runImport.js:49`
- **Estado**: ❌ Descartado. Verificado en BD: el campo `fechaPrest` de la tabla `prestamos` almacena correctamente el formato `YYYY-MM-DD`. A pesar de que `parseDate` retorna un objeto `Date` de JavaScript, `mysql2` lo serializa adecuadamente y la fecha se guarda sin desfase. No es un bug.

---

## 4. Scripts duplicados: `importData.js` y `runImport.js`

- **`importData.js`**: Parece ser una versión preliminar. Tiene el bug del `TRUNCATE TABLE` y no cierra el pool en `finally`.
- **`runImport.js`**: Versión más robusta. Usa `tx.delete()` transactional, cierra el pool en `finally`, mejor manejo de errores.
- **Problema**: Confusión sobre cuál script usar. Ambos hacen exactamente lo mismo (importar `HABERES.TXT` y `PRESTAMOS.TXT`).

---

## 5. `actualizar-socios.js` no mapea `avatar`, `password`, `rol`

- **Archivo**: `scripts/actualizar-socios.js:120-146`
- **Campos del schema NO mapeados**:
  | Campo en schema | Tipo | ¿Debería importarse? |
  |-----------------|------|----------------------|
  | `avatar` | `varchar(255)` | No (se sube por separado) |
  | `password` | `varchar(255)` | No (se crea en registro) |
  | `rol` | `mysqlEnum('socio', 'admin')` | No (default 'socio') |
- **Estado**: No es un bug. Es intencional porque esos campos no vienen del archivo `SOCIOS.txt`. Al hacer `update(socios).set(socioData)`, Drizzle simplemente ignora las propiedades `undefined`.
- **Nota**: En inserción de nuevos socios, `rol` tomará el valor por defecto `'socio'` definido en el schema. Esto es correcto.

---

## Resumen de gravedad

| #  | Inconsistencia | Gravedad | Tipo |
|----|---------------|----------|------|
| 1  | `importar_socios.js` no existe | 🔴 Alta | Referencia rota |
| 2  | `TRUNCATE TABLE` en transacción | 🔴 Alta | Bug de integridad |
| 3  | `parseDate` devuelve `Date` object | 🟡 Media | Potencial error de fecha |
| 4  | Scripts duplicados | 🟡 Media | Mantenibilidad |
| 5  | `avatar`, `password`, `rol` no mapeados | 🟢 Baja | Comportamiento esperado |
