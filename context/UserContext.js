'use client';
import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/dashboard/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Si la respuesta no es OK (ej. 401, 404, 500), no hay usuario
          setUser(null);
        }
      } catch (error) {
        // Si hay un error de red o fetch falla, no hay usuario
        console.error("Error al obtener el usuario:", error); // Log para depuración
        setUser(null); // CORRECCIÓN
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);