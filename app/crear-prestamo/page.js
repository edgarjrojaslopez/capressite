// /app/crear-prestamo/page.js
import CrearPrestamoForm from '@/components/CrearPrestamoForm';

export default function CrearPrestamoPage() {
  const userId = 'USR123'; // Esto debería venir de tu sistema de autenticación

  return (
    <div className="p-6">
      <CrearPrestamoForm userId={userId} />
    </div>
  );
}
