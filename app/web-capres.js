import React, { useState, useEffect } from 'react';

// App Component - Main Application Structure
export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Simulated JWT login functionality
  const handleLogin = (username) => {
    const mockUser = {
      username,
      token: `mock-jwt-token-${Date.now()}`,
      role: 'member',
    };
    setUser(mockUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navigation */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
            </svg>
            <h1 className="text-xl font-bold">CAPRES</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <button onClick={() => setActivePage('home')} className="hover:underline">Inicio</button>
            <button onClick={() => setActivePage('about')} className="hover:underline">Nosotros</button>
            <button onClick={() => setActivePage('loans')} className="hover:underline">Préstamos</button>
            <button onClick={() => setActivePage('delegates')} className="hover:underline">Delegados</button>
            <button onClick={() => setActivePage('documents')} className="hover:underline">Documentos</button>
            <button onClick={() => setActivePage('contact')} className="hover:underline">Contacto</button>
            {!isLoggedIn ? (
              <button onClick={() => setActivePage('login')} className="hover:underline">Iniciar Sesión</button>
            ) : (
              <div className="relative group">
                <span className="cursor-pointer">{user.username}</span>
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg hidden group-hover:block z-10">
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Cerrar Sesión</button>
                </div>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Render Active Page */}
      <main className="container mx-auto px-4 py-8">
        {activePage === 'home' && <HomePage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'loans' && <LoansPage />}
        {activePage === 'delegates' && <DelegatesPage />}
        {activePage === 'documents' && <DocumentsPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'login' && <LoginPage onLogin={handleLogin} />}
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">CAPRES</h3>
              <p className="text-sm">Caja de Ahorros y Previsión de los empleados del SENIAT</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setActivePage('about')} className="hover:underline">Sobre Nosotros</button></li>
                <li><button onClick={() => setActivePage('loans')} className="hover:underline">Préstamos</button></li>
                <li><button onClick={() => setActivePage('documents')} className="hover:underline">Documentos</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setActivePage('contact')} className="hover:underline">Contáctenos</button></li>
                <li><button onClick={() => setActivePage('login')} className="hover:underline">Área Privada</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Redes Sociales</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-700 mt-8 pt-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} CAPRES - Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Home Page Component
function HomePage() {
  return (
    <div>
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Bienvenido a CAPRES</h2>
          <p className="max-w-2xl">
            La Caja de Ahorros y Previsión de los empleados del SENIAT es una institución financiera comprometida con el bienestar económico de sus socios.
            Ofrecemos servicios financieros seguros y confiables para ayudarte a alcanzar tus metas personales y familiares.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-3">Nuestra Misión</h3>
          <p className="text-gray-600">
            Promover la cultura del ahorro y brindar servicios financieros accesibles que fortalezcan la economía de nuestros asociados.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-3">Nuestra Visión</h3>
          <p className="text-gray-600">
            Ser la principal opción financiera para los empleados del SENIAT, reconociendo por nuestra solidez, innovación y servicio personalizado.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-3">Valores</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Transparencia</li>
            <li>Confianza</li>
            <li>Responsabilidad</li>
            <li>Solidaridad</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Noticias Recientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Nueva Línea de Crédito para Vivienda",
              date: "15/03/2025",
              summary: "CAPRES anuncia una nueva línea de crédito para vivienda con tasas preferenciales para socios activos."
            },
            {
              title: "Asamblea General Ordinaria",
              date: "10/03/2025",
              summary: "Se informa a todos los socios sobre la celebración de la Asamblea General Ordinaria el próximo mes de abril."
            }
          ].map((news, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <span className="text-sm text-blue-600 font-medium">{news.date}</span>
              <h3 className="text-xl font-semibold mt-2 mb-2">{news.title}</h3>
              <p className="text-gray-600 mb-4">{news.summary}</p>
              <button className="text-blue-600 hover:underline text-sm">Leer más →</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// About Page Component
function AboutPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
      
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Historia de CAPRES</h3>
        <p className="mb-4">
          CAPRES fue creada en 1985 con el objetivo de proveer un sistema de ahorro y préstamo seguro y accesible para los empleados del SENIAT.
          A lo largo de estos años, hemos crecido y evolucionado para adaptarnos a las necesidades cambiantes de nuestros asociados.
        </p>
        <p className="mb-4">
          Nuestra trayectoria ha estado marcada por el compromiso con la transparencia, la responsabilidad social y el desarrollo sostenible de nuestros socios.
        </p>
        <p>
          Actualmente contamos con más de 10,000 socios activos y ofrecemos una amplia gama de productos y servicios financieros diseñados específicamente para el colectivo SENIAT.
        </p>
      </section>

      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Junta Directiva</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Dr. Juan Pérez", role: "Presidente", image: "https://placehold.co/300x300?text=Presidente" },
            { name: "Lic. María Gómez", role: "Vicepresidente", image: "https://placehold.co/300x300?text=Vicepresidente" },
            { name: "Ing. Carlos Rojas", role: "Tesorero", image: "https://placehold.co/300x300?text=Tesorero" }
          ].map((member, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
              <img src={member.image} alt={member.name} className="w-24 h-24 mx-auto rounded-full mb-4" />
              <h4 className="font-semibold">{member.name}</h4>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">Organigrama</h3>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            El organigrama detallado de CAPRES está disponible en formato PDF para su descarga desde la sección de Documentos.
          </p>
        </div>
      </section>
    </div>
  );
}

// Loans Page Component
function LoansPage() {
  const [loanType, setLoanType] = useState('short');

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Préstamos para Socios</h2>
      
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'short', label: 'Corto Plazo' },
            { id: 'medium', label: 'Mediano Plazo' },
            { id: 'long', label: 'Largo Plazo' },
            { id: 'special', label: 'Especiales' }
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

        {loanType === 'short' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Préstamos a Corto Plazo</h3>
            <p className="mb-4">
              Préstamos diseñados para cubrir necesidades inmediatas o emergencias, con plazos de hasta 12 meses.
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
              <li>Monto máximo: Bs. 5.000.000</li>
              <li>Tasa de interés: 2% mensual</li>
              <li>Plazo máximo: 12 meses</li>
              <li>Requisitos: Solicitud escrita, copia de cédula, certificación laboral</li>
            </ul>
            <p className="text-sm text-gray-500">
              * Los préstamos están sujetos a aprobación según políticas internas y capacidad de pago del socio.
            </p>
          </div>
        )}

        {loanType === 'medium' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Préstamos a Mediano Plazo</h3>
            <p className="mb-4">
              Soluciones financieras para proyectos importantes con plazos entre 13 y 36 meses.
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
              <li>Monto máximo: Bs. 15.000.000</li>
              <li>Tasa de interés: 1.8% mensual</li>
              <li>Plazo máximo: 36 meses</li>
              <li>Requisitos: Solicitud escrita, copia de cédula, certificación laboral, avalistas</li>
            </ul>
            <p className="text-sm text-gray-500">
              * Los préstamos están sujetos a aprobación según políticas internas y capacidad de pago del socio.
            </p>
          </div>
        )}

        {loanType === 'long' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Préstamos a Largo Plazo</h3>
            <p className="mb-4">
              Financiamiento para proyectos significativos con plazos superiores a 36 meses.
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
              <li>Monto máximo: Bs. 30.000.000</li>
              <li>Tasa de interés: 1.5% mensual</li>
              <li>Plazo máximo: 60 meses</li>
              <li>Requisitos: Solicitud escrita, copia de cédula, certificación laboral, avalistas y garantías adicionales</li>
            </ul>
            <p className="text-sm text-gray-500">
              * Los préstamos están sujetos a aprobación según políticas internas y capacidad de pago del socio.
            </p>
          </div>
        )}

        {loanType === 'special' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Préstamos Especiales</h3>
            <p className="mb-4">
              Productos financieros diseñados para situaciones particulares como estudios universitarios, salud o eventos especiales.
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
              <li>Préstamo educativo: Hasta Bs. 20.000.000 para estudios universitarios</li>
              <li>Préstamo médico: Hasta Bs. 10.000.000 para gastos médicos urgentes</li>
              <li>Préstamo familiar: Hasta Bs. 5.000.000 para eventos sociales importantes</li>
              <li>Requisitos: Solicitud escrita, copia de cédula, certificación laboral y documentación específica según tipo de préstamo</li>
            </ul>
            <p className="text-sm text-gray-500">
              * Los préstamos están sujetos a aprobación según políticas internas y capacidad de pago del socio.
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Proceso de Solicitud</h3>
        <div className="bg-white p-6 rounded-lg shadow">
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Acercarse a la oficina más cercana o descargar el formulario de solicitud</li>
            <li>Llenar el formulario con información completa y veraz</li>
            <li>Adjuntar los documentos requeridos según el tipo de préstamo</li>
            <li>Presentar la solicitud ante la comisión de créditos</li>
            <li>Espere la notificación de aprobación (máximo 5 días hábiles)</li>
            <li>Si es aprobado, firme el contrato y reciba los fondos en su cuenta</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// Delegates Page Component
function DelegatesPage() {
  const regions = [
    { name: "Capital", delegates: 5 },
    { name: "Central", delegates: 4 },
    { name: "Andina", delegates: 6 },
    { name: "Oriental", delegates: 4 },
    { name: "Zuliana", delegates: 5 },
    { name: "Insular", delegates: 3 }
  ];

  const delegates = [
    { name: "Carlos Mendoza", region: "Capital", contact: "carlos.mendoza@capres.com", phone: "+58 412-1234567" },
    { name: "Ana Rojas", region: "Central", contact: "ana.rojas@capres.com", phone: "+58 414-2345678" },
    { name: "Luis Torres", region: "Andina", contact: "luis.torres@capres.com", phone: "+58 424-3456789" },
    { name: "María Fernández", region: "Oriental", contact: "maria.fernandez@capres.com", phone: "+58 416-4567890" },
    { name: "Javier Morales", region: "Zuliana", contact: "javier.morales@capres.com", phone: "+58 412-5678901" },
    { name: "Patricia Reyes", region: "Insular", contact: "patricia.reyes@capres.com", phone: "+58 414-6789012" }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Delegados Regionales</h2>
      
      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Representantes por Región</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {regions.map((region, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold">{region.name}</h4>
              <p className="text-gray-600">{region.delegates} delegados</p>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>
            Los delegados son representantes electos por los socios para participar en las asambleas y reuniones de la junta directiva.
            Su función principal es defender los intereses de los socios de su región y servir como enlace entre los asociados y la administración.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">Lista de Delegados</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Región</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo Electrónico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {delegates.map((delegate, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{delegate.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{delegate.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={`mailto:${delegate.contact}`} className="text-blue-600 hover:underline">{delegate.contact}</a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{delegate.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// Documents Page Component
function DocumentsPage() {
  const documents = [
    { name: "Formulario de Solicitud de Préstamo", type: "PDF", size: "250 KB" },
    { name: "Estatutos de la Caja de Ahorros", type: "PDF", size: "500 KB" },
    { name: "Manual de Procedimientos", type: "PDF", size: "1.2 MB" },
    { name: "Formato de Cancelación de Préstamo", type: "DOCX", size: "180 KB" },
    { name: "Solicitud de Afiliación", type: "PDF", size: "300 KB" },
    { name: "Políticas de Gestión de Riesgos", type: "PDF", size: "800 KB" }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Documentos</h2>
      
      <section>
        <h3 className="text-2xl font-semibold mb-4">Descargas Disponibles</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{doc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{doc.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:underline">Descargar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">¿No encuentras el documento que buscas?</h3>
          <p className="mb-4">
            Si necesitas algún documento adicional o tienes preguntas sobre los formularios disponibles, no dudes en contactarnos.
          </p>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' }) && setTimeout(() => document.getElementById('contact'), 500)}
          >
            Contáctanos
          </button>
        </div>
      </section>
    </div>
  );
}

// Contact Page Component
function ContactPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Contáctanos</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Información de Contacto</h3>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex items-start mb-4">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h4 className="font-semibold">Dirección</h4>
                <p>Avenida Principal de Caracas, Edificio CAPRES, Piso 5<br />Caracas, Venezuela</p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <h4 className="font-semibold">Teléfono</h4>
                <p>+58 212-1234567</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h4 className="font-semibold">Correo Electrónico</h4>
                <p>info@capres.gob.ve</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Horario de Atención</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Lunes a Viernes: 8:00 AM - 4:00 PM</li>
              <li>Sábados: 9:00 AM - 12:00 PM</li>
              <li>Domingos: Cerrado</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">Ubicación</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden h-80 mb-6">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Mapa interactivo irá aquí</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Formulario de Contacto</h3>
          <form className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Login Page Component
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6">Área Privada</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Iniciar Sesión</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">¿No tienes cuenta?</h3>
        <p className="mb-4">
          Si eres un socio de CAPRES y no tienes acceso al área privada, acércate a la oficina más cercana para registrarte.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Más Información
        </button>
      </div>
    </div>
  );
}
