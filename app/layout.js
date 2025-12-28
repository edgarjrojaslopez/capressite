import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
