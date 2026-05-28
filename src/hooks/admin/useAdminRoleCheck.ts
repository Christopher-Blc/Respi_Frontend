import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import api from '../../services/api';

/**
 * Hook que verifica al montar si el usuario actual sigue siendo admin.
 * Si el rol ya no es SUPER_ADMIN, invalida la sesión y lo envía al login.
 * Retorna el estado del modal y el componente a renderizar.
 */
export const useAdminRoleCheck = () => {
  const { role, signOut } = useAuth();
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
          setShowExpiredModal(true);

          // Hacer logout después de mostrar el modal
          setTimeout(async () => {
            await signOut();
            router.replace('/(auth)/login');
          }, 1500);
        }
      } catch {
        // Silent fail: no interrumpir la experiencia si la verificación falla
      }
    };

    checkAdminRole();
  }, [role, signOut]);

  return { showExpiredModal, setShowExpiredModal };
};
