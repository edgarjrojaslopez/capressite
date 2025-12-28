// components/HomePage.jsx
'use client';
import Jumbotron from '@/components/Jumbotron';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Función para formatear la fecha
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-VE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// Recorta texto con longitud máxima
const truncate = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength
    ? text.substring(0, maxLength).trim() + '...'
    : text;
};

export default function HomePage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/noticias')
      .then((res) => {
        if (!res.ok)
          throw new Error('No se pudieron cargar las noticias desde la API');
        return res.json();
      })
      .then((data) => setNews(data))
      .catch((err) => {
        console.error('Error al cargar noticias:', err);
        setNews([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="mb-12">
        <Jumbotron />
      </section>

      {/* Misión, Visión, Valores */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Nuestra Misión
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Promover la cultura del ahorro y brindar servicios financieros
            accesibles que fortalezcan la economía de nuestros asociados.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Nuestra Visión
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Ser la principal opción financiera para los empleados del SENIAT,
            caracterizada por nuestra solidez, innovación y servicio
            personalizado.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Valores</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed">
            <li>Transparencia</li>
            <li>Confianza</li>
            <li>Responsabilidad</li>
            <li>Solidaridad</li>
          </ul>
        </div>
      </section>

      {/* Noticias Recientes */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Noticias Recientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="col-span-2 text-center py-10">
              <p className="text-gray-500 text-lg">Cargando noticias...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="col-span-2 text-center py-10">
              <p className="text-gray-500 text-lg">
                No hay noticias disponibles en este momento.
              </p>
            </div>
          ) : (
            news.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Fecha */}
                <div className="px-6 pt-6">
                  <span className="text-sm font-medium text-blue-600">
                    {formatDate(item.fechaCreacion)}
                  </span>
                </div>

                {/* Título */}
                <div className="px-6 pt-2 pb-4">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                    {item.titulo}
                  </h3>
                </div>

                {/* Resumen */}
                <div className="px-6 pb-4">
                  <p className="text-gray-600 line-clamp-3">
                    {truncate(item.resumen || item.contenido, 160)}
                  </p>
                </div>

                {/* Enlace */}
                <div className="px-6 pb-6">
                  <Link
                    href={`/noticia/${item.id}`}
                    className="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm transition"
                  >
                    Leer más →
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
