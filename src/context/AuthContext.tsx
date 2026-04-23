import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionExpiredModal } from '../components/sessionExpired.modal';
import {
  getToken,
  logout,
  onForceLogout,
  saveRefreshToken,
  saveToken,
} from '../services/authStorage';
import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';
import { JWTPayload } from '../types/types';

const AuthContext = createContext<{
  userToken: string | null;
  role: 'SUPER_ADMIN' | 'CLIENTE' | null;
  isLoading: boolean;
  signIn: (accessToken: string, refreshToken: string) => void;
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
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const decodeAndSetRole = (token: string) => {
    try {
      const decoded = jwtDecode(token) as unknown as JWTPayload;
      if (decoded && decoded.role) {
        setRole(decoded.role);
      }
    } catch (error) {
      console.error('Error decodificando el token:', error);
      setRole(null);
    }
  };

  useEffect(() => {
    onForceLogout(() => {
      setShowExpiredModal(true);
    });
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
        console.error('Fallo al recuperar token:', error);
      } finally {
        clearTimeout(timer);
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const handleConfirmExpired = () => {
    setShowExpiredModal(false);
    setUserToken(null);
    setRole(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        role,
        isLoading,
        // Cambiamos signIn para recibir ambos
        signIn: async (accessToken, refreshToken) => {
          setUserToken(accessToken);
          decodeAndSetRole(accessToken);
          await saveToken(accessToken);
          if (refreshToken) {
            await saveRefreshToken(refreshToken);
          }
        },
        signOut: async () => {
          setUserToken(null);
          setRole(null);
          await logout(false); // Esto ya borra ambos tokens según tu authStorage
          router.replace('/(auth)/login');
        },
      }}
    >
      {children}
      <SessionExpiredModal
        visible={showExpiredModal}
        onConfirm={handleConfirmExpired}
        isDarkMode={false}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
