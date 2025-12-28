// components/Jumbotron.jsx

import Link from 'next/link';

export default function Jumbotron() {
  return (
    <div
      className="
        relative
        bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600
        text-white
        px-6 py-16 md:py-24
        min-h-[60vh] md:min-h-[80vh]
        flex
        items-center
      "
    >
      {/* Fondo opcional con imagen */}

      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('/images/d03fcb52-6eec-44cc-ae31-fe6aa891e404.png')",
        }}
      ></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left px-4">
        {/* Título principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 ">
          <span className="text-yellow-300 py-1 rounded-lg shadow-sm">
            CAPRES
          </span>
        </h1>

        {/* Subtítulo mejorado */}
        <p className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-2xl mx-auto md:mx-0 mb-8 leading-relaxed">
          Tu socio financiero dentro del SENIAT.{' '}
          <span className="block md:inline mt-2 md:mt-0">
            <span className="text-white font-semibold">
              Ahorra con beneficios, invierte con confianza
            </span>{' '}
            y accede a préstamos personalizados, diseñados especialmente para
            tí.
          </span>
        </p>

        {/* Botón de Iniciar Sesión */}
        <Link
          href="/login"
          className="
      inline-block
      bg-white text-blue-800
      font-bold
      px-8 py-4
      rounded-xl
      shadow-lg
      hover:bg-blue-50
      hover:shadow-xl
      transition-all
      duration-300
      text-lg
      mx-auto md:mx-0
      transform hover:scale-105
      focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50
    "
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
