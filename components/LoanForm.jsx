// components/LoanForm.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoanForm({ userId, username }) {
  const router = useRouter();
  const [loanType, setLoanType] = useState('short');
  const [amount, setAmount] = useState(0); // ✅ Inicializado como número
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId,
          username,
          type: loanType,
          amount: Number(amount), // ✅ Fuerza conversión a número
          reason,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || 'Préstamo solicitado exitosamente.');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(data.error || 'Hubo un problema al enviar tu préstamo');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión al servidor');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Tipo de Préstamo
            (Luego de solicitar el préstamo, debe esperar un lapso de entre 24 y 48 horas para revisar su cuenta de nómina)
          </label>
          <select
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="short">Corto Plazo</option>
            <option value="medium">Mediano Plazo</option>
            <option value="long">Largo Plazo</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Monto Solicitado
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))} // ✅ Convertido a número
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Bs. 5.000.000"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Motivo del Préstamo
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Describe brevemente para qué usarás el préstamo..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}
