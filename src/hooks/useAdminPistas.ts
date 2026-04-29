import { useState, useEffect } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import { Pista, TipoPista } from '../types/types';
import api from '../services/api';
import { usePistaForm } from './usePistaForm';
import { usePistaMaintenance } from './usePistaMaintenance';
import { usePistaFilters } from './usePistaFilters';

export { WEEK_DAYS, createDefaultWeeklySchedule } from './pistaUtils';

export function useAdminPistas() {
  const { width } = useWindowDimensions();
  const weeklyCardWidth = width >= 1400 ? '32%' : width >= 980 ? '49%' : '100%';

  const [pistas, setPistas] = useState<Pista[]>([]);
  const [tiposPista, setTiposPista] = useState<TipoPista[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPistas = async () => {
    try {
      setLoading(true);
      const [pistaRes, tipoRes] = await Promise.all([
        api.get('/pista'),
        api.get('/tipo_pista'),
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

  const form = usePistaForm(pistas, fetchPistas);
  const maintenance = usePistaMaintenance(pistas, fetchPistas);
  const filters = usePistaFilters(pistas, searchQuery);

  return {
    pistas,
    tiposPista,
    loading,
    searchQuery,
    setSearchQuery,
    weeklyCardWidth,
    ...form,
    ...maintenance,
    ...filters,
  };
}
