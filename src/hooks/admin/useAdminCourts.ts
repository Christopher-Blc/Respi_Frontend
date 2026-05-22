import { useState, useEffect } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import { Installation, Court, CourtType } from '../../types/types';
import api from '../../services/api';
import { useCourtForm } from '../useCourtForm';
import { useCourtMaintenance } from '../useCourtMaintenance';
import { useCourtFilters } from '../useCourtFilters';

export { WEEK_DAYS, createDefaultWeeklySchedule } from '../courtUtils';

export function useAdminCourts() {
  const { width } = useWindowDimensions();
  const weeklyCardWidth = width >= 1400 ? '32%' : width >= 980 ? '49%' : '100%';

  const [pistas, setPistas] = useState<Court[]>([]);
  const [tiposPista, setTiposPista] = useState<CourtType[]>([]);
  const [instalaciones, setInstalaciones] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInstalaciones = async () => {
     const response = await api.get('/installations');
    const rows = Array.isArray(response?.data)
      ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
            : Array.isArray(response?.data?.items)
              ? response.data.items
              : [];

    if (rows.length > 0) {
      setInstalaciones(rows);
      return;
    }
      
    

    setInstalaciones([]);
  };

  const fetchPistas = async () => {
    try {
      setLoading(true);
      const [pistaRes, tipoRes] = await Promise.all([
        api.get('/courts'),
        api.get('/court-types'),
        fetchInstalaciones(),
      ]);
      setPistas(pistaRes.data);
      setTiposPista(tipoRes.data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las pistas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPistas();
  }, []);

  const form = useCourtForm(pistas, instalaciones, fetchPistas);
  const maintenance = useCourtMaintenance(pistas, fetchPistas);
  const filters = useCourtFilters(pistas, searchQuery);

  return {
    pistas,
    tiposPista,
    instalaciones,
    loading,
    searchQuery,
    setSearchQuery,
    weeklyCardWidth,
    ...form,
    ...maintenance,
    ...filters,
  };
}
