 import React, { createContext, useContext, useState, useEffect } from 'react';
import { deleteToken, getToken, saveToken } from '../services/authStorage';
import { jwtDecode } from 'jwt-decode';


interface JWTPayload {
  sub: number;
  email: string;
  role: 'SUPER_ADMIN' | 'CLIENTE';
  // añade aquí otros campos que vengan en tu token (sub, id, etc.)
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
      // Usamos "as unknown as JWTPayload" para saltar el error de TS
      const decoded = jwtDecode(token) as unknown as JWTPayload;
      
      if (decoded && decoded.role) {
        setRole(decoded.role);
      } else {
        setRole(null);
      }
    } catch (error) {
      console.error("Error decodificando el token:", error);
      setRole(null);
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken(); 
      if (token) {
        setUserToken(token);
        decodeAndSetRole(token); 
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{
      userToken,
      role,
      isLoading,
      signIn: async (token) => { //tiene q ser async pq si no es web , hace un await
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



