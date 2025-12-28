// components/AboutPage.jsx
// About Page Component
export default function AboutPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">¿Quiénes somos?</h2>

      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Historia de CAPRES</h3>
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <p className="mb-4">
            El día 22 de Junio de 1995, 53 funcionarios adscritos al Servicio
            Nacional Integrado de Administración Tributaria (SENIAT) se
            reunieron a objeto de constituir lo que es hoy “La Caja de Ahorro y
            Previsión de los Empleados del Servicio Nacional Integrado de
            Administración Aduanera y Tributaria SENIAT – CAPRES”; teniendo por
            objeto principal establecer y fomentar el ahorro sistemático y en
            general procurar para sus asociados toda clase de beneficios
            socioeconómicos.
          </p>
          <p className="mb-4">
            Nuestra trayectoria ha estado marcada por el compromiso con la
            transparencia, la responsabilidad social y el desarrollo sostenible
            de nuestros socios.
          </p>
          <p className="mb-4">
            Actualmente contamos con más de 4.500 socios activos y ofrecemos servicios financieros diseñados
            específicamente para el colectivo SENIAT.
          </p>
          <p className="mb-4">Además, es oportuno hacer de tu conocimiento que al estar inscrito en la Caja de Ahorro, el SENIAT (patrono), se obliga a depositarte un monto adicional del <span className="font-bold">12% de tu sueldo.</span></p>
          <p className="mb-4 text-xl font-semibold text-center">Si piensas en un mejor futuro: inscríbete en la Caja de Ahorro - CAPRES.</p>
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">
          Consejo de Administración
        </h3>
        <div className="bg-white p-4 mb-6 rounded-lg shadow text-center">
          <img
            src="EloyNoriega.png"
            alt="Presidente Capres"
            className="w-24 h-24 mx-auto rounded-full mb-4"
          />
          <h4 className="font-semibold text-lg md:text-2xl">Eloy Noriega</h4>
          <p className="text-gray-600 text-lg">Presidente</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: 'Raúl Lucena',
              role: 'Tesorero',
              image: 'https://placehold.co/300x300?text=Vicepresidente',
            },
            {
              name: 'Gustavo Soler',
              role: 'Secretario',
              image: 'https://placehold.co/300x300?text=Tesorero',
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow text-center"
            >
              <h4 className="font-semibold md:text-lg">{member.name}</h4>
              <p className="text-gray-600 text-sm md:text-lg">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">
          Consejo de Administración (Suplentes)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Luis Vidal',
              role: 'Presidente',
              image: 'https://placehold.co/300x300?text=Presidente',
            },
            {
              name: 'María Elena Barrios',
              role: 'Tesorera',
              image: 'https://placehold.co/300x300?text=Vicepresidente',
            },
            {
              name: 'Marisol Duque',
              role: 'Secretaria',
              image: 'https://placehold.co/300x300?text=Tesorero',
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg  shadow text-center"
            >
              <h4 className="font-semibold md:text-lg">{member.name}</h4>
              <p className="text-gray-600 text-sm md:text-lg">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Consejo de Vigilancia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Víctor Ojeda',
              role: 'Presidente',
              image: 'https://placehold.co/300x300?text=Presidente',
            },
            {
              name: 'Mayuri Troya',
              role: 'Vice-Presidente',
              image: 'https://placehold.co/300x300?text=Vicepresidente',
            },
            {
              name: 'Dora Castillo',
              role: 'Secretaria',
              image: 'https://placehold.co/300x300?text=Tesorero',
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow text-center"
            >
              <h4 className="font-semibold md:text-lg">{member.name}</h4>
              <p className="text-gray-600 text-sm md:text-lg">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">
          Consejo de Vigilancia (Suplentes)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Janeth Vera',
              role: 'Presidente',
              image: 'https://placehold.co/300x300?text=Presidente',
            },
            {
              name: 'Richard Landaeta',
              role: 'Vice-Presidente',
              image: 'https://placehold.co/300x300?text=Vicepresidente',
            },
            {
              name: 'Daysi Seijas',
              role: 'Secretaria',
              image: 'https://placehold.co/300x300?text=Tesorero',
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow text-center"
            >
              <h4 className="font-semibold md:text-lg">{member.name}</h4>
              <p className="text-gray-600 text-sm md:text-lg">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">Organigrama</h3>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            El organigrama detallado de CAPRES está disponible en formato PDF
            para su descarga desde la sección de Documentos.
          </p>
        </div>
      </section>
    </div>
  );
}
