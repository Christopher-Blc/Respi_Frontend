/**
 * useAdminReports.ts
 *
 * Hook que gestiona l'estat de generació d'informes PDF.
 * Cada informe té el seu propi estat de loading per mostrar
 * feedback individual al botó que s'ha premut.
 */

import { useCallback, useState } from 'react';
import { generateReport, ReportType } from '../../services/reportsService';

type LoadingState = Record<ReportType, boolean>;

export function useAdminReports() {
  const [loading, setLoading] = useState<LoadingState>({
    reservations: false,
    users: false,
    revenue: false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (type: ReportType) => {
    setError(null);
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      await generateReport(type);
    } catch (e) {
      setError('Error al generar l\'informe. Torna-ho a intentar.');
      console.error(`[Reports] Error generating ${type}:`, e);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  }, []);

  return { loading, error, handleGenerate };
}
