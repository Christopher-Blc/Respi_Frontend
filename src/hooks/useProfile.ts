import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { User, Membresia } from '../types/types';
import { reservasActivasFilter } from '../filtersApi';

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [totalReservas, setTotalReservas] = useState<number>(0);
  const [currentMembership, setCurrentMembership] = useState<Membresia | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar Perfil
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile/me');
      setUser(response.data);
      return response.data; // Para encadenar si hace falta
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // 2. Cargar Reservas
  const fetchTotalReservas = async () => {
    try {
      const response = await api.get('reserva/mis-reservas');
      const responseFiltrado = reservasActivasFilter(response);
      setTotalReservas(responseFiltrado.length);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // 3. Cargar Detalles de Membresía
  const fetchMembershipById = async (id: number | null | undefined) => {
    if (id == null) {
      setCurrentMembership(null);
      return;
    }
    try {
      const response = await api.get('/membresia');
      const payload = response.data;
      const parsed = Array.isArray(payload) ? payload : payload?.data || [];
      const found = parsed.find((m: Membresia) => m.membresia_id === id);
      setCurrentMembership(found || null);
    } catch (error) {
      console.error('Error fetching membership:', error);
    }
  };

  // 4. Lógica de iniciales (Calculada)
  const avatarInitials = useMemo(() => {
    const first = user?.name?.trim()?.[0] || '';
    const last = user?.surname?.trim()?.[0] || '';
    if (first || last) return `${first}${last}`.toUpperCase();
    return (user?.username?.[0] || 'U').toUpperCase();
  }, [user]);

  // 5. Etiqueta de membresía
  const userMembershipLabel = useMemo(() => {
    if (user?.membresia_id == null) return 'Sin membresia';
    return currentMembership 
      ? `${currentMembership.nombre} · Rango ${currentMembership.rango}` 
      : `Cargando...`;
  }, [user, currentMembership]);

  // Ejecución inicial
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      const userData = await fetchUserProfile();
      await fetchTotalReservas();
      if (userData?.membresia_id) {
        await fetchMembershipById(userData.membresia_id);
      }
      setLoading(false);
    };
    loadAll();
  }, []);

  return {
    user,
    totalReservas,
    currentMembership,
    loading,
    avatarInitials,
    userMembershipLabel,
    refreshProfile: fetchUserProfile, // Por si quieres un "Pull to refresh"
  };
};