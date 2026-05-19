import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import api from '../services/api';

/**
 * Hook que verifica periódicamente si el usuario actual sigue siendo admin.
 * Si el rol cambia a CLIENTE (otro admin lo cambió), invalida la sesión y lo envía al login.
 * Retorna el estado del modal y el componente a renderizar.
 */
export const useAdminRoleCheck = () => {
  const { role, signOut } = useAuth();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  useEffect(() => {
    // Solo verificar si estamos en la pantalla admin y el usuario es admin
    if (role !== 'SUPER_ADMIN') return;

    const checkAdminRole = async () => {
      try {
        const response = await api.get('/users/profile/me');
        const userData = response.data;

        // Si el usuario ya no es admin, invalidar sesión
        if (userData?.role !== 'SUPER_ADMIN') {
          console.warn(
            'Admin role removed while in admin screen, logging out...',
          );
          setShowExpiredModal(true);

          // Hacer logout después de mostrar el modal
          setTimeout(async () => {
            await signOut();
            router.replace('/(auth)/login');
          }, 1500);
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
  }, [role, signOut]);

  return { showExpiredModal, setShowExpiredModal };
};
