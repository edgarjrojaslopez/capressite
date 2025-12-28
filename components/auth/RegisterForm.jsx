'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    cedula: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    
    // Validación de cédula
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!/^[VE]?\d{7,8}$/i.test(formData.cedula)) {
      newErrors.cedula = 'Formato de cédula inválido. Use el formato V12345678 o E12345678';
    }

    // Validación de email
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    } else if (formData.email.length > 100) {
      newErrors.email = 'El correo electrónico no puede tener más de 100 caracteres';
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      } else if (formData.password.length > 72) {
        newErrors.password = 'La contraseña no puede tener más de 72 caracteres';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos una letra minúscula';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos una letra mayúscula';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos un número';
      } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?])/.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos un carácter especial';
      } else if (formData.password.includes(' ')) {
        newErrors.password = 'La contraseña no puede contener espacios en blanco';
      }
    }

    // Validación de confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return;
    }
    
    // Prevenir múltiples envíos
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    // Limpiar datos sensibles del formulario en el estado
    const formDataToSend = { ...formData };
    formDataToSend.cedula = formDataToSend.cedula.trim().toUpperCase();
    formDataToSend.email = formDataToSend.email.trim().toLowerCase();

    try {
      // Validar token CSRF si está configurado
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf-token='))
        ?.split('=')[1];

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRF-Token': csrfToken })
        },
        body: JSON.stringify({
          cedula: formDataToSend.cedula,
          email: formDataToSend.email,
          password: formDataToSend.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }

      setMessage({
        type: 'success',
        text: data.emailSent 
          ? '¡Registro exitoso! Se ha enviado un correo con instrucciones para continuar.'
          : 'Registro exitoso. Por favor inicia sesión con tus credenciales.',
      });
      
      // Clear form on success
      setFormData({
        cedula: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      // Mensajes de error más amigables
      let errorMessage = 'Error en el registro. Por favor intente nuevamente.';
      
      if (error.message.includes('ya está registrad')) {
        errorMessage = 'Esta cédula ya está registrada. ¿Olvidaste tu contraseña?';
      } else if (error.message.includes('network')) {
        errorMessage = 'Error de conexión. Por favor verifica tu conexión a internet.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({
        type: 'error',
        text: errorMessage,
      });
      
      // Registrar el error de manera segura
      if (process.env.NODE_ENV === 'development') {
        console.error('Error en registro:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Registro de Socio</h2>
      
      {message.text && (
        <div 
          className={`p-4 mb-6 rounded ${
            message.type === 'error' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">
            Cédula
          </label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.cedula ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            placeholder="Ej: 12345678"
          />
          {errors.cedula && (
            <p className="mt-1 text-sm text-red-600">{errors.cedula}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            placeholder="tu@correo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } p-2 pr-10`}
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } p-2 pr-10`}
              placeholder="Vuelve a escribir tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
