// /components/CrearPrestamoForm.jsx
'use client';

import { useState } from 'react';

export default function CrearPrestamoForm({ userId }) {
  const [formData, setFormData] = useState({
    user_id: userId || '', // 👈 Recibimos el userId desde props
    monto: '',
    plazoMeses: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error.message);
        setSuccess('');
      } else {
        setSuccess('Préstamo creado exitosamente');
        setError('');
        setFormData({ user_id: userId, monto: '', plazoMeses: '' });
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Solicitar Préstamo</h2>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}
      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4">{success}</div>
      )}

      {/* Campo oculto o dinámico */}
      <input type="hidden" name="user_id" value={formData.user_id} />

      <div className="mb-4">
        <label className="block mb-1">Monto</label>
        <input
          type="number"
          name="monto"
          value={formData.monto}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Plazo en Meses</label>
        <input
          type="number"
          name="plazoMeses"
          value={formData.plazoMeses}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Registrar Préstamo
      </button>
    </form>
  );
}
