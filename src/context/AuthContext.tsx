 import React, { createContext, useContext, useState, useEffect } from 'react';
import { deleteToken, getToken, saveToken } from '../services/authStorage';

const AuthContext = createContext<{
  userToken: string | null;
  isLoading: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
}>({
  userToken: null,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      //usamos la funcion de authstorage pq alli ya se controla lo de la plataforma para que no pete en web
      const token = await getToken(); 
      setUserToken(token);
      setIsLoading(false);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{
      userToken,
      isLoading,
      signIn: async (token) => { //tiene q ser async pq si no es web , hace un await
        setUserToken(token);
        await saveToken(token); 
      },
      signOut: async () => {
        setUserToken(null);
        await deleteToken();
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);