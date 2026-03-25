 import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

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
      const token = await SecureStore.getItemAsync('user_auth_token');
      setUserToken(token);
      setIsLoading(false);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{
      userToken,
      isLoading,
      signIn: (token) => {
        setUserToken(token);
        SecureStore.setItemAsync('user_auth_token', token);
      },
      signOut: () => {
        setUserToken(null);
        SecureStore.deleteItemAsync('user_auth_token');
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);