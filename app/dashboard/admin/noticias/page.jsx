// app/dashboard/admin/noticias/page.jsx
'use client';

import { useEffect, useState } from 'react';

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    id: null,
    titulo: '',
    resumen: '',
    contenido: '',
    imagenUrl: '',
  });

  // Cargar noticias
  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/noticias');
      if (!res.ok) throw new Error('No se pudo obtener la lista de noticias.');
      const data = await res.json();
      setNoticias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar subida de imagen
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (jpg, png, etc.)');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, imagenUrl: data.url }));
      } else {
        throw new Error('No se recibió la URL');
      }
    } catch (err) {
      console.error('Error al subir imagen:', err);
      alert('Error al subir la imagen. Intenta de nuevo.');
    }
  };

  // Enviar formulario (POST o PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = form.id ? `/api/noticias/${form.id}` : '/api/noticias';
    const method = form.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Algo salió mal.');
      }

      await fetchNoticias();
      resetForm();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (noticia) => {
    setForm({
      id: noticia.id,
      titulo: noticia.titulo,
      resumen: noticia.resumen || '',
      contenido: noticia.contenido,
      imagenUrl: noticia.imagenUrl || '',
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) return;

    try {
      const res = await fetch(`/api/noticias/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar la noticia.');
      await fetchNoticias();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      titulo: '',
      resumen: '',
      contenido: '',
      imagenUrl: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Noticias</h1>

      {/* Formulario */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {form.id ? 'Editar Noticia' : 'Crear Nueva Noticia'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-700"
            >
              Título
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={form.titulo}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Resumen */}
          <div>
            <label
              htmlFor="resumen"
              className="block text-sm font-medium text-gray-700"
            >
              Resumen
            </label>
            <textarea
              id="resumen"
              name="resumen"
              rows="3"
              value={form.resumen}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Contenido */}
          <div>
            <label
              htmlFor="contenido"
              className="block text-sm font-medium text-gray-700"
            >
              Contenido (HTML permitido)
            </label>
            <textarea
              id="contenido"
              name="contenido"
              rows="10"
              value={form.contenido}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Subir imagen */}
          <div>
            <label
              htmlFor="imagen"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Imagen de la noticia
            </label>
            <input
              type="file"
              id="imagen"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Vista previa de la imagen */}
          {form.imagenUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vista previa
              </label>
              <img
                src={form.imagenUrl}
                alt="Vista previa"
                className="w-48 h-32 object-cover rounded-lg shadow"
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar Edición
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {form.id ? 'Actualizar Noticia' : 'Guardar Noticia'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de noticias */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Noticias Publicadas</h2>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <h3 className="font-semibold">{noticia.titulo}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(noticia.fechaCreacion).toLocaleDateString('es-VE')}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(noticia)}
                  className="px-3 py-1 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-md"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(noticia.id)}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
