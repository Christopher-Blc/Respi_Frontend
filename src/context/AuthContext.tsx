import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { SessionExpiredModal } from '../components/general/alert.modal';
import {
  getRefreshToken,
  getToken,
  logout,
  onForceLogout,
  saveRefreshToken,
  saveToken,
} from '../services/auth/authStorage';
import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';
import { JWTPayload } from '../types/types';
import api from '../services/api';
import axios from 'axios';

type DecodedJWTPayload = JWTPayload & { exp?: number };

const AuthContext = createContext<{
  userToken: string | null;
  role: 'SUPER_ADMIN' | 'CLIENTE' | null;
  effectiveRole: 'SUPER_ADMIN' | 'CLIENTE' | null;
  canToggleRole: boolean;
  isLoading: boolean;
  lastRoleVerifiedAt: number | null;
  signIn: (accessToken: string, refreshToken: string) => void;
  signOut: () => void;
  toggleRoleView: () => void;
  refreshRoleVerification: () => Promise<void>;
}>({
  userToken: null,
  role: null,
  effectiveRole: null,
  canToggleRole: false,
  isLoading: true,
  lastRoleVerifiedAt: null,
  signIn: () => {},
  signOut: () => {},
  toggleRoleView: () => {},
  refreshRoleVerification: async () => {},
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
  // BUG-SEC-010: Tracks when role was last confirmed via server-side check.
  // Use refreshRoleVerification() to re-trigger verification on demand.
  const [lastRoleVerifiedAt, setLastRoleVerifiedAt] = useState<number | null>(
    null,
  );
  const suppressForcedLogoutModalRef = useRef(false);
  const isHandlingForcedLogoutRef = useRef(false);

  // BUG-SEC-001 / BUG-SEC-010:
  // SECURITY NOTE — JWT signature verification:
  //   1. Client-side JWT signature verification is not possible without the backend public key.
  //   2. Security relies on the backend validating the Bearer token on every API request.
  //   3. The useAdminRoleCheck hook provides an additional server-side role verification layer.
  // The decode here is used ONLY for UI routing (extracting role/sub for navigation decisions).

  const decodeAndSetRole = (token: string): 'ok' | 'expired' | 'invalid' => {
    try {
      const decoded = jwtDecode(token) as DecodedJWTPayload;

      // BUG-SEC-001: Basic sanity check — ensure expected fields are present and token is not expired.
      const now = Math.floor(Date.now() / 1000);
      if (!decoded || !decoded.sub || !decoded.role || !decoded.exp) {
        console.error('Token missing required fields (sub, role, exp).');
        setRole(null);
        setUserId(null);
        return 'invalid';
      }
      if (decoded.exp < now) {
        console.warn('Stored token is expired (client-side exp check).');
        return 'expired';
      }

      setRole(decoded.role);
      setUserId(Number(decoded.sub));
      return 'ok';
    } catch (error) {
      console.error('Error decodificando el token:', error);
      setRole(null);
      setUserId(null);
      return 'invalid';
    }
  };

  const _toggleRoleEnvRaw = process.env.EXPO_PUBLIC_TOGGLE_ROLE_IDS;
  const toggleRoleIds = (_toggleRoleEnvRaw ?? '31,41')
    .split(',')
    .map((id: string) => parseInt(id.trim(), 10))
    .filter((id: number) => !isNaN(id));
  // BUG-EDGE-009: Warn when the env var is explicitly set but produced no valid IDs,
  // so developers notice a misconfiguration instead of role-toggle silently breaking.
  if (_toggleRoleEnvRaw !== undefined && toggleRoleIds.length === 0) {
    console.warn(
      '[AuthContext] EXPO_PUBLIC_TOGGLE_ROLE_IDS is set but could not be parsed. Role toggle will be disabled.',
    );
  }
  const canToggleRole = toggleRoleIds.includes(userId ?? -1);
  const effectiveRole =
    canToggleRole && roleViewOverride ? roleViewOverride : role;

  const toggleRoleView = () => {
    if (!canToggleRole) return;
    const current = effectiveRole ?? role;
    const next = current === 'SUPER_ADMIN' ? 'CLIENTE' : 'SUPER_ADMIN';
    setRoleViewOverride(next);
  };

  useEffect(() => {
    const cleanupForceLogout = onForceLogout(() => {
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
          const decodeStatus = decodeAndSetRole(token);

          if (decodeStatus === 'ok') {
            setUserToken(token);
            return;
          }

          // If access token is expired/invalid but refresh token exists, restore session.
          const refreshToken = await getRefreshToken();
          if (!refreshToken) {
            await logout(false);
            setUserToken(null);
            setRole(null);
            setUserId(null);
            setRoleViewOverride(null);
            return;
          }

          try {
            const refreshResponse = await axios.post(
              `${api.defaults.baseURL}/auth/refresh`,
              { refresh_token: refreshToken },
            );

            const nextAccessToken = refreshResponse.data?.access_token as
              | string
              | undefined;
            const nextRefreshToken = refreshResponse.data?.refresh_token as
              | string
              | undefined;

            if (!nextAccessToken) {
              throw new Error('Refresh response missing access_token');
            }

            await saveToken(nextAccessToken);
            if (nextRefreshToken) {
              await saveRefreshToken(nextRefreshToken);
            }

            const refreshedDecodeStatus = decodeAndSetRole(nextAccessToken);
            if (refreshedDecodeStatus !== 'ok') {
              throw new Error('Refreshed token is invalid or expired');
            }

            setUserToken(nextAccessToken);
          } catch (refreshError) {
            console.error(
              'No se pudo restaurar la sesión con refresh token:',
              refreshError,
            );
            await logout(false);
            setUserToken(null);
            setRole(null);
            setUserId(null);
            setRoleViewOverride(null);
          }
        }
      } catch (error) {
        console.error('Fallo al recuperar token:', error);
      } finally {
        clearTimeout(timer);
        setIsLoading(false);
      }
    };
    loadToken();
    return cleanupForceLogout;
  }, []);

  const handleConfirmExpired = () => {
    setShowExpiredModal(false);
    setUserToken(null);
    setRole(null);
    router.replace('/(auth)/login');
  };

  // BUG-SEC-010: Re-triggers server-side role verification via the useAdminRoleCheck mechanism.
  // Call this whenever you want to re-confirm the user's role with the backend (e.g., on app foreground).
  // No polling is set up here — callers decide when to invoke this.
  const refreshRoleVerification = async (): Promise<void> => {
    try {
      const response = await api.get<{ role: string }>('/auth/me');
      const serverRole = response.data?.role as
        | 'SUPER_ADMIN'
        | 'CLIENTE'
        | null;
      if (serverRole) {
        setRole(serverRole);
        setLastRoleVerifiedAt(Date.now());
      }
    } catch {
      // TODO: backend must expose GET /auth/me returning { role } for this to work.
      // If the endpoint does not exist yet, this will silently fail — add it server-side.
    }
  };

  const handleSignOut = async () => {
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
    await logout(false);
    router.replace('/(auth)/login');

    // Evita que un 401 rezagado de peticiones en vuelo dispare el modal tras logout manual.
    setTimeout(() => {
      suppressForcedLogoutModalRef.current = false;
    }, 2000);
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        role,
        isLoading,
        lastRoleVerifiedAt,
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
        signOut: handleSignOut,
        effectiveRole,
        canToggleRole,
        toggleRoleView,
        refreshRoleVerification,
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
