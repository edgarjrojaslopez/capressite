'use client';
import Header from '@/components/Header02';
import Footer from '@/components/Footer';
import DocumentsPage from '@/components/DocumentsPage';

export default function DocumentsPageRoute() {
  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <DocumentsPage />
      </main>
    </>
  );
}
