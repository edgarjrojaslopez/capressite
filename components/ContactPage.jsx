'use client';
import { useEffect, useRef, useState } from 'react';

// components/ContactPage.jsx
// Contact Page Component
export default function ContactPage() {
  const mapRef = useRef(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('¡Mensaje enviado exitosamente! Te responderemos pronto.');
        setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      } else {
        setMessage(data.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      setMessage('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar Leaflet dinámicamente
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // Cargar CSS de Leaflet
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Cargar JS de Leaflet
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!mapRef.current || !window.L) return;

      // Coordenadas exactas de CAPRES
      const capresLocation = [10.497717, -66.8850067];

      const map = window.L.map(mapRef.current).setView(capresLocation, 17);

      // Agregar tiles de OpenStreetMap
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Agregar marcador con popup
      const marker = window.L.marker(capresLocation).addTo(map);

      marker
        .bindPopup(
          `
        <div style="text-align: center; padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1e40af; font-weight: bold; font-size: 16px;">CAPRES</h3>
          <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 500;">Caja de Ahorro SENIAT</p>
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #666; line-height: 1.4;">
            Plaza Venezuela, Avenida Quito<br>
            Caracas 1052, Distrito Capital<br>
            Venezuela
          </p>
          <p style="margin: 0; font-size: 12px; color: #1e40af; font-weight: 500;">
            📞 +58 0212-7094761
          </p>
        </div>
      `
        )
        .openPopup();
    };

    loadLeaflet();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Contáctanos</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4">
            Información de Contacto
          </h3>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex items-start mb-4">
              <svg
                className="w-6 h-6 text-blue-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold">Dirección</h4>
                <p>
                  Plaza Venezuela, Avenida Quito, <br />
                  Caracas 1052, Distrito Capital,
                  <br /> Venezuela
                </p>
              </div>
            </div>

            <div className="flex items-start mb-4">
              <svg
                className="w-6 h-6 text-blue-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <h4 className="font-semibold">Teléfono</h4>
                <p>+58 0212-7094761</p>
                <p>+58 0212-7094758</p>
                <p>+58 0212-7094746</p>
                <p>+58 0212-7094764</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-blue-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <h4 className="font-semibold">Correo Electrónico</h4>
                <p>contactenos@capres.com.ve</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Horario de Atención</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Lunes a Viernes: 8:00 AM - 4:00 PM</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">Ubicación</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden h-80 mb-6">
            <div
              ref={mapRef}
              className="w-full h-full"
              style={{ minHeight: '320px' }}
            />
          </div>

          <h3 className="text-2xl font-semibold mb-4">
            Formulario de Contacto
          </h3>
          <form
            className="bg-white p-6 rounded-lg shadow"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asunto
              </label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                rows="4"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {message && (
              <div
                className={`mb-4 p-3 rounded ${
                  message.includes('exitosamente')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
