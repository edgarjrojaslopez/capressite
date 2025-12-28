# Scripts de Importación

## Importar Socios

Este script lee el archivo `SOCIOS.txt` y actualiza la tabla `socios` en la base de datos.

### Funcionalidad

1. Lee el archivo `/public/data/SOCIOS.txt`
2. Filtra los registros con "Estatus" igual a "A"
3. Conecta a la base de datos MySQL usando variables de entorno
4. Compara con la tabla `socios` y:
   - Actualiza registros existentes
   - Inserta nuevos registros si no existen

### Variables de Entorno Requeridas

Asegúrate de tener configuradas las siguientes variables en tu archivo `.env.local`:

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña_mysql
MYSQL_DATABASE=capres_web
```

### Ejecución

#### Método 1: Usando npm scripts
```bash
npm run importar-socios
```

#### Método 2: Ejecución directa
```bash
node scripts/importar_socios.js
```

### Estructura del Archivo SOCIOS.txt

El archivo debe tener la siguiente estructura en la primera línea (encabezados):
```
"CodSocio";"NombreCompleto";"Estatus";"NroCtaBanco";"Frecuencia";"CodigoTN";"FechaIngreso";"PorAporteS";"PorAporteP";"SaldoInicial";"SaldoActual";"FecUltimoPrestamo";"Estado";"Organismo";"Telefonos";"CodInterno";"FechaUltRecPago";"MtoUltRecPago";"FechaEgreso";"FechaRegistro";"UltimaModificacion";"Email";"CodCargo";"Usuario";"Pcname"
```

### Mapeo de Campos

El script mapea los siguientes campos del archivo a la tabla de la base de datos:

| Campo SOCIOS.txt | Campo Tabla socios | Observaciones |
|------------------|-------------------|---------------|
| CodSocio | CodSocio | Clave primaria |
| NombreCompleto | NombreCompleto | |
| Estatus | Estatus | Solo procesa "A" |
| NroCtaBanco | NroCtaBanco | |
| FechaIngreso | FechaIng | Formato dd/mm/yyyy |
| PorAporteS | PorAporteS | Convierte coma a punto |
| PorAporteP | PorAporteP | Convierte coma a punto |
| SaldoInicial | SaldoInicial | Convierte coma a punto |
| SaldoActual | SaldoActual | Convierte coma a punto |
| FecUltimoPrestamo | FecUltimoPrestamo | Formato dd/mm/yyyy |
| Estado | Estado | Convierte "1" a 1, resto a 0 |
| Telefonos | Telefonos | |
| FechaEgreso | FechaEgreso | Formato dd/mm/yyyy |
| FechaRegistro | FechaRegistro | Formato dd/mm/yyyy |
| Email | Email | |

### Salida del Script

El script mostrará en consola:
- Socios insertados
- Socios actualizados
- Resumen final de la operación

### Consideraciones

- El archivo SOCIOS.txt debe estar codificado en Latin-1 (ISO-8859-1)
- Las fechas se convierten automáticamente del formato dd/mm/yyyy a yyyy-mm-dd
- Los números decimales usan coma como separador y se convierten a punto
- El script solo procesa registros con Estatus = "A"
