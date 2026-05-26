import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { SessionExpiredModal } from '../components/alert.modal';
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
import api from '../services/api';

const AuthContext = createContext<{
  userToken: string | null;
  role: 'SUPER_ADMIN' | 'CLIENTE' | null;
  effectiveRole: 'SUPER_ADMIN' | 'CLIENTE' | null;
  canToggleRole: boolean;
  isLoading: boolean;
  signIn: (accessToken: string, refreshToken: string) => void;
  signOut: () => void;
  toggleRoleView: () => void;
}>({
  userToken: null,
  role: null,
  effectiveRole: null,
  canToggleRole: false,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
  toggleRoleView: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [role, setRole] = useState<'SUPER_ADMIN' | 'CLIENTE' | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [roleViewOverride, setRoleViewOverride] = useState<
    'SUPER_ADMIN' | 'CLIENTE' | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const suppressForcedLogoutModalRef = useRef(false);
  const isHandlingForcedLogoutRef = useRef(false);

  const decodeAndSetRole = (token: string) => {
    try {
      const decoded = jwtDecode(token) as unknown as JWTPayload;
      if (decoded && decoded.role) {
        setRole(decoded.role);
        setUserId(Number(decoded.sub));
      }
    } catch (error) {
      console.error('Error decodificando el token:', error);
      setRole(null);
      setUserId(null);
    }
  };

  const canToggleRole = userId === 31 || userId === 41;
  const effectiveRole =
    canToggleRole && roleViewOverride ? roleViewOverride : role;

  const toggleRoleView = () => {
    if (!canToggleRole) return;
    const current = effectiveRole ?? role;
    const next = current === 'SUPER_ADMIN' ? 'CLIENTE' : 'SUPER_ADMIN';
    setRoleViewOverride(next);
  };

  useEffect(() => {
    onForceLogout(() => {
      if (
        suppressForcedLogoutModalRef.current ||
        isHandlingForcedLogoutRef.current
      ) {
        return;
      }

      isHandlingForcedLogoutRef.current = true;

      // Forced logout should be silent to avoid modal flicker behind other dialogs.
      setShowExpiredModal(false);
      setUserToken(null);
      setRole(null);
      setUserId(null);
      setRoleViewOverride(null);
      router.replace('/(auth)/login');

      setTimeout(() => {
        isHandlingForcedLogoutRef.current = false;
      }, 1500);
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
          suppressForcedLogoutModalRef.current = false;
          setRoleViewOverride(null);
          setUserToken(accessToken);
          decodeAndSetRole(accessToken);
          await saveToken(accessToken);
          if (refreshToken) {
            await saveRefreshToken(refreshToken);
          }
        },
        signOut: async () => {
          suppressForcedLogoutModalRef.current = true;
          setShowExpiredModal(false);

          try {
            await api.post('/users/clear-token');
          } catch {
            // Silent fail: logout should continue even if token cleanup fails.
          }

          setUserToken(null);
          setRole(null);
          setUserId(null);
          setRoleViewOverride(null);
          await logout(false); // Esto ya borra ambos tokens según tu authStorage
          router.replace('/(auth)/login');

          // Evita que un 401 rezagado de peticiones en vuelo dispare el modal tras logout manual.
          setTimeout(() => {
            suppressForcedLogoutModalRef.current = false;
          }, 2000);
        },
        effectiveRole,
        canToggleRole,
        toggleRoleView,
      }}
    >
      {children}
      <SessionExpiredModal
        visible={showExpiredModal}
        variant="session"
        onConfirm={handleConfirmExpired}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
