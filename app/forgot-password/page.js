// app/forgot-password/page.js
// import { Suspense } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Recuperar contraseña
          </h1>
          <p className="mt-2 text-gray-600">
            Ingresa tu cédula para recibir un enlace de recuperación
          </p>
        </div>

        {/* IMPORTANTE: Quita Suspense aquí si usas un componente cliente */}
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
