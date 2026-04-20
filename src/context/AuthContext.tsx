import React, { createContext, useContext, useState, useEffect } from 'react';
import { deleteToken, getToken, saveToken } from '../services/authStorage';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: number;
  email: string;
  role: 'SUPER_ADMIN' | 'CLIENTE';
}

const AuthContext = createContext<{
  userToken: string | null;
  role: 'SUPER_ADMIN' | 'CLIENTE' | null;
  isLoading: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
}>({
  userToken: null,
  role: null,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [role, setRole] = useState<'SUPER_ADMIN' | 'CLIENTE' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const decodeAndSetRole = (token: string) => {
    try {
      const decoded = jwtDecode(token) as unknown as JWTPayload;
      if (decoded && decoded.role) {
        setRole(decoded.role);
      }
    } catch (error) {
      console.error("Error decodificando el token:", error);
      setRole(null);
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      // Seguro de vida: si en 7 segundos no hay respuesta, cortamos el loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 7000);

      try {
        const token = await getToken(); 
        if (token) {
          setUserToken(token);
          decodeAndSetRole(token); 
        }
      } catch (error) {
        console.error("Fallo al recuperar token:", error);
      } finally {
        clearTimeout(timer);
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{
      userToken,
      role,
      isLoading,
      signIn: async (token) => {
        setUserToken(token);
        decodeAndSetRole(token);   
        await saveToken(token);
      },
      signOut: async () => {
        setUserToken(null);
        setRole(null);
        await deleteToken();
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);