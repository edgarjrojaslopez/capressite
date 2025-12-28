'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState({
    marcoLegal: [],
    operaciones: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await fetch('/api/documents/list');
        const data = await response.json();
        setDocuments(data.documents || { marcoLegal: [], operaciones: [] });
      } catch (error) {
        console.error('Error cargando documentos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const handleDownload = (category, filename) => {
    const link = document.createElement('a');
    link.href = `/assets/files/${category}/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Componente DocumentList (responsive)
  const DocumentList = ({ title, documents, category, icon }) => {
    if (!documents || documents.length === 0) {
      return (
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            {title}
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
            No hay documentos disponibles.
          </div>
        </section>
      );
    }

    return (
      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h3>

        {/* Vista de tabla (desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{doc.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      PDF
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{doc.size}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDownload(category, doc.filename)}
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
                      aria-label={`Descargar ${doc.name}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista de lista (móvil) */}
        <div className="md:hidden space-y-3">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {doc.name}
                </h4>
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  PDF
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Tamaño: {doc.size}
              </div>
              <button
                onClick={() => handleDownload(category, doc.filename)}
                className="w-full text-left text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                aria-label={`Descargar ${doc.name}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Descargar
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando documentos...</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">📄 Documentos</h2>

      <section className="mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-700">
            Aquí encontrarás todos los documentos oficiales de CAPRES
            organizados por categorías. Puedes descargar los formularios,
            estatutos y documentación legal necesaria.
          </p>
        </div>
      </section>

      <DocumentList
        title="Marco Legal"
        documents={documents.marcoLegal}
        category="marco_legal"
        icon="⚖️"
      />

      <DocumentList
        title="Operaciones y Trámites"
        documents={documents.operaciones}
        category="operaciones"
        icon="📋"
      />

      <section className="mt-12">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            ¿No encuentras el documento que buscas?
          </h3>
          <p className="mb-4">
            Si necesitas algún documento adicional o tienes preguntas sobre los
            formularios disponibles, no dudes en contactarnos.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Contacto
          </Link>
        </div>
      </section>
    </div>
  );
}
