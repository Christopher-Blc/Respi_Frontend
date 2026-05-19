import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import api from '../services/api';
import { JWTPayload } from '../types/types';
import { jwtDecode } from 'jwt-decode';

/**
 * Hook que verifica periódicamente si el usuario actual sigue siendo admin.
 * Si el rol cambia a CLIENTE (otro admin lo cambió), lo redirije fuera del área admin.
 */
export const useAdminRoleCheck = () => {
  const { role, userToken } = useAuth();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastRoleRef = useRef<string | null>(null);

  useEffect(() => {
    // Solo verificar si estamos en la pantalla admin y el usuario es admin
    if (role !== 'SUPER_ADMIN') return;

    const checkAdminRole = async () => {
      try {
        const response = await api.get('/users/profile/me');
        const userData = response.data;

        // Si el usuario ya no es admin, redirigir
        if (userData?.role !== 'SUPER_ADMIN') {
          console.warn(
            'Admin role removed while in admin screen, redirecting...',
          );
          router.replace('/(app)/(tabs)/');
        }
      } catch (error) {
        // Silent fail: no interrumpir la experiencia si la verificación falla
        console.debug('Admin role check failed:', error);
      }
    };

    // Verificar inmediatamente al montar
    checkAdminRole();

    // Luego verificar cada 30 segundos
    intervalRef.current = setInterval(checkAdminRole, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [role]);
};
