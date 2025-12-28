// app/loans/request/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header02';
import Footer from '@/components/Footer';
import LoanForm from '@/components/LoanForm';

export default function LoanRequestPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Verificar token al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el JWT
      setUser({
        id: payload.id,
        username: payload.username,
        role: payload.role,
      });
    } catch (err) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Solicitar Préstamo</h1>
        <LoanForm userId={user.id} username={user.username} />
      </main>
    </>
  );
}
