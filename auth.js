// auth.js — RAÍZ DEL PROYECTO
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { socios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { shouldForcePasswordChange } from '@/lib/auth-utils';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set in the environment variables');
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        cedula: { label: 'Cédula', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },

      async authorize(credentials) {
        console.log('🔐 Iniciando autorización para cédula:', credentials?.cedula);

        if (!credentials?.cedula || !credentials.password) {
          console.error('❌ Faltan credenciales');
          throw new Error('Cédula y contraseña son requeridas');
        }

        try {
          // Buscar usuario por cédula
          const user = await db
            .select()
            .from(socios)
            .where(eq(socios.CodSocio, credentials.cedula))
            .limit(1);

          if (!user || user.length === 0) {
            console.error('❌ Usuario no encontrado:', credentials.cedula);
            throw new Error('Usuario no encontrado');
          }

          const foundUser = user[0];
          console.log('✅ Usuario encontrado:', foundUser.CodSocio, foundUser.NombreCompleto);

          // Verificar contraseña
          if (!foundUser.password) {
            console.error('❌ Usuario sin contraseña en BD');
            throw new Error('Error de autenticación');
          }

          const isValid = await bcrypt.compare(credentials.password, foundUser.password);
          if (!isValid) {
            console.error('❌ Contraseña incorrecta para usuario:', credentials.cedula);
            throw new Error('Contraseña incorrecta');
          }

          // Detectar si la contraseña es la predeterminada
const mustChangePassword = await shouldForcePasswordChange(foundUser.password);
            if (mustChangePassword) {
              console.log('🔄 Usuario con contraseña por defecto detectado, debe cambiar contraseña');
            }

            return {
              id: foundUser.CodSocio,
              name: foundUser.NombreCompleto,
              email: foundUser.Email || `${foundUser.CodSocio}@capres.com`,
              image: null,
              rol: foundUser.rol || 'socio',
              mustChangePassword,
            };

        } catch (error) {
          console.error('❌ Error en authorize:', error);
          throw error;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
    updateAge: 60 * 60, // Actualiza la sesión cada hora
  },

  pages: {
    signIn: '/login',
    error: '/login?error=signin'
  },

  // Configuración CSRF
  csrf: {
    // Habilitar protección CSRF estricta
    enable: true,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.rol = user.rol;
        token.mustChangePassword = user.mustChangePassword;
        token.accessToken = user.id; // Añadir el ID del usuario como accessToken
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.rol = token.rol;
        session.user.mustChangePassword = token.mustChangePassword;
        session.accessToken = token.accessToken; // Pasar el accessToken a la sesión
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});
