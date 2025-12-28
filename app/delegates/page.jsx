'use client';
import Header from '@/components/Header02';
import Footer from '@/components/Footer';
import DelegatesPage from '@/components/DelegatesPage';

export default function DelegatesPageRoute() {
  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <DelegatesPage />
      </main>
    </>
  );
}
