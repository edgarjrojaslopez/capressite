// components/Footer.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react'; // X usa el ícono de Twitter

export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Logo / Nombre */}
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/assets/images/capres.jpg"
                alt="Logo de la Caja de Ahorro"
                width={160}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-blue-100">
              Caja de Ahorro y Previsión de los empleados del SENIAT
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:underline transition">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/loans" className="hover:underline transition">
                  Préstamos
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:underline transition">
                  Documentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="font-bold mb-4">Soporte </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:underline transition">
                  Contáctenos
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline transition">
                  Área Privada
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h3 className="font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-6">
              {/* Facebook */}
              <a
                href="https://facebook.com/capres"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/capres"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-300 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>

              {/* X (antes Twitter) */}
              <a
                href="https://x.com/capres"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors duration-200"
                aria-label="X"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Derechos de autor */}
        <div className="border-t border-blue-700 mt-8 pt-6 text-center text-sm text-blue-100">
          <p>
            &copy; {new Date().getFullYear()} CAPRES - Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
