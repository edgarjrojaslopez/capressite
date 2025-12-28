// app/api/auth/[...nextauth]/route.js
import { handlers } from '@/auth'; // ← ¡RUTA RELATIVA! SIEMPRE FUNCIONA

export const { GET, POST } = handlers;
