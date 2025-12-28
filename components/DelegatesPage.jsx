// components/DelegatesPage.jsx
// Delegates Page Component
export default function DelegatesPage() {
  const regions = [
    { name: 'Los Andes', delegates: 1 },
    { name: 'Zuliana', delegates: 2 },
    { name: 'Nor-Oriental', delegates: 1 },
    { name: 'Capital', delegates: 4 },
    { name: 'Insular', delegates: 1 },
    { name: 'Guayana', delegates: 1 },
  ];

  const delegates = [
    {
      region: 'Región Los Andes',

      nombre: 'Mariela Carrero',

      cedula: '5.446.421',
    },

    {
      region: 'Aduana Marítima',

      nombre: 'Gregoria Flores',

      cedula: '7.702.986',
    },

    {
      region: 'Tributos Internos',

      nombre: 'Anelsis Quintero',

      cedula: '7.713.948',
    },

    {
      region: 'Aduana de Maturín',

      nombre: 'Milexis Veliz',

      cedula: '9.926.228',
    },

    {
      region: 'Región Capital',

      nombre: 'Yenis Carreño',

      cedula: '10.470.037',
    },

    {
      region: 'Gerencia de Contribuyentes Especiales',

      nombre: 'Tulio Colina',

      cedula: '11.941.120',
    },

    {
      region: 'Nivel Normativo',

      nombre: 'Adabel Becerra',

      cedula: '14.472.836',
    },

    {
      region: 'Región lnsular de Tributos Internos',

      nombre: 'Luis Cardona',

      cedula: '12.672.797',
    },

    {
      region: 'Región   Nor-Oriental',

      nombre: 'Juan  Pineda',

      cedula: '8.479.968',
    },

    {
      region: 'Aduana Aérea de Maiquetía',

      nombre: 'Marianela Salazar',

      cedula: '12.460.212',
    },

    {
      region: 'Región Guayana, Aduana',

      nombre: 'Deiby Barrios',

      cedula: '6.445.946',
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Delegados Regionales</h2>

      <section className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p>
            Los delegados son representantes electos por los socios para
            participar en las asambleas y reuniones de la junta directiva del
            consejo de administración. Su función principal es defender los
            intereses de los socios de su región y servir como enlace entre los
            asociados y la administración.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Lista de Delegados</h3>

        {/* Tabla para desktop */}
        <div className="hidden md:block overflow-x-auto">
          <div className="bg-white rounded-lg shadow min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Región
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cédula
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {delegates.map((delegate, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {delegate.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {delegate.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {delegate.cedula}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tarjetas para móvil (responsive) */}
        <div className="md:hidden space-y-4">
          {delegates.map((delegate, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3"
            >
              <div>
                <p className="text-sm text-gray-700 mt-1">{delegate.region}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {delegate.nombre}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-700 mt-1">{delegate.cedula}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
