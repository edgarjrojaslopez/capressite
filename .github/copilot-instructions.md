<!-- Instrucciones concisas para agentes AI que editan/añaden código en este repo -->

# Instrucciones rápidas para editores automáticos

Este repositorio es una aplicación Next.js (Next 14) con un servidor Node.js personalizado (`server.js`) y autenticación manejada por `next-auth` y Drizzle ORM sobre MySQL. Sigue estas reglas concretas cuando generes o modifiques código:

- Arquitectura y flujo principal:

  - Frontend y rutas de la app en `app/` (Next 14, React Server Components). Ej.: `app/page.js`, `app/dashboard/page.js`.
  - Server personalizado en `server.js` que usa `next` y crea un `http` server; no asumas que `next start` se usa en dev.
  - Autenticación en `auth.js` con `next-auth` (CredentialsProvider). Usa `db` en `lib/db` y el esquema `lib/db/schema` (Drizzle). Nunca omitas verificar `process.env.NEXTAUTH_SECRET` cuando trabajes con auth.

- Convenciones de seguridad y sesiones:

  - Sesiones usan JWT (ver callbacks en `auth.js`). Si modificas claims, actualiza `jwt` y `session` callbacks juntos.
  - El proyecto detecta contraseñas por defecto (`password123`) y establece flags (`mustChangePassword`, `forcePasswordChange`) — respeta esos flags en flujos de login y redirección.

- Middleware y rutas públicas:

  - `middleware.js` contiene `publicPaths` y `roleBasedPaths`. Actualmente el middleware permite todo para debugging; si restringes rutas, ajusta `config.matcher` con cuidado para no bloquear `/_next` o `api`.

- Scripts y ejecución:

  - Scripts principales: `npm run dev` (Next dev), `npm run build` (Next build), `npm start` (usa `server.js`). En entornos Windows la variable `PORT` puede venir del entorno; `server.js` usa `hostname='localhost'`.

- Dependencias y patrones DB:

  - Drizzle ORM + `mysql2` (ver `lib/db`), bcrypt para contraseñas (`bcryptjs`). Cuando accedas a la BD usa las consultas existentes en `lib/` para mantener consistencia.

- Estilo y estructura de componentes:

  - Componentes React en `components/` y páginas en `app/`. Se usa CSS global en `styles/globals.css`. Respeta la separación: UI/inputs en `components/ui/`.

- Manejo de errores y responses API:

  - Usa `lib/errorHandler.js` para formular respuestas JSON consistentes (ej. `AuthError`). Las APIs esperan Response objects con JSON y status apropiado.

- Qué evitar y notas importantes:

  - No elimines o cambies `NEXTAUTH_SECRET` ni el esquema de JWT sin migrar sesiones.
  - No asumas que los endpoints de `api/` tienen protección completa — revisa `middleware.js` y `auth.js`.
  - Evita cambios masivos en la estructura `app/` sin revisar `server.js` y `middleware.js`.

- Ejemplos rápidos (referencias):
  - Añadir claim JWT: actualizar `auth.js` -> `callbacks.jwt` y `callbacks.session`.
  - Redirigir por fuerza de cambio de contraseña: `auth.js` ya establece `redirectTo` y `forcePasswordChange`.

Si algo en este fichero queda confuso, pide al mantenedor ejemplos concretos (ruta, archivo y comportamiento esperado) antes de hacer cambios grandes.
