import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Registro - CAPRES',
  description: 'Registro de socios CAPRES',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          CAPRES
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Registro de Socio
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
