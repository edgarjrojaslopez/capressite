// components/Providers.js
'use client'; // 👈 Marcar como Client Component

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
