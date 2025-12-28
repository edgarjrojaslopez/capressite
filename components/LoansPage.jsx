// components/LoansPage.jsx
'use client';

import React, { useState } from 'react';

export default function LoansPage() {
  const [loanType, setLoanType] = useState('short');

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Préstamos para Socios</h2>
      <section>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>
            La Caja de Ahorro y Previsión Social de los Empleados del Servicio
            Nacional Integrado de Administración Aduanera y Tributaria SENIAT –
            CAPRES, podrá conceder a los Asociados que tengan una antigüedad
            igual o mayor a seis (6) meses las siguientes clases de préstamo: a)
            Préstamos a corto plazo; b) Préstamos a mediano plazo; c) Préstamos
            a largo plazo.
          </p>
        </div>
        <br />
        <div className="bg-white p-6 rounded-lg shadow">
          <p>
            Los préstamos a Corto Plazo, Mediano Plazo y Largo Plazo, no podrán
            exceder en ningún caso del ochenta por ciento (80%) de sus haberes
            en la caja, debiendo mantener siempre un fondo mínimo del veinte por
            ciento (20%).
          </p>
        </div>
        <br />
      </section>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'short', label: 'Corto Plazo' },
            { id: 'medium', label: 'Mediano Plazo' },
            { id: 'long', label: 'Largo Plazo' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setLoanType(type.id)}
              className={`px-4 py-2 rounded-full ${
                loanType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Contenido según tipo de préstamo */}
        {loanType === 'short' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              Préstamos a Corto Plazo
            </h3>
            <p className="mb-4">
              Préstamos diseñedos para cubrir necesidades inmediatas o
              emergencias, con plazos de hasta 12 mes.
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
              <li>Monto máximo: 80% de los haberes.</li>
              <li>
                Tasa de interés: 8% anual, intereses serán causados a
                vencimiento mensual.
              </li>
              <li>Plazo máximo: 12 meses</li>
              <li>
                Requisitos: Solicitud escrita, copia de cédula, certificación
                laboral
              </li>
            </ul>
            <p className="text-sm text-gray-500">
              * Los préstamos están sujetos a aprobación según políticas
              internas y capacidad de pago del socio.
            </p>
          </div>
        )}

        {loanType === 'medium' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              Préstamos a Mediano Plazo
            </h3>
            <p className="mb-4">
              Soluciones financieras para proyectos importantes con plazos entre
              13 y 36 meses.
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
              <li>Monto máximo: 80% haberes</li>
              <li>Tasa de interés: 10% anual</li>
              <li>Plazo máximo: 24 meses</li>
              <li>
                Requisitos: Solicitud escrita, copia de cédula, último recibo de
                pago.
              </li>
            </ul>
            <p className="text-sm text-gray-500">
              * Los préstamos están sujetos a aprobación según políticas
              internas y capacidad de pago del socio.
            </p>
          </div>
        )}

        {loanType === 'long' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              Préstamos a Largo Plazo
            </h3>
            <p className="mb-4">
              Financiamiento para proyectos significativos con plazos superiores
              a 36 meses.
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
              <li>Monto máximo: 80% haberes</li>
              <li>Tasa de interés: 12% anual</li>
              <li>Plazo máximo: 36 meses</li>
              <li>
                Requisitos: Solicitud escrita, copia de cédula, certificación
                laboral, avalistas y garantías adicionales
              </li>
            </ul>
            <p className="text-sm text-gray-500">
              * Los préstamos están sujetos a aprobación según políticas
              internas y capacidad de pago del socio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
