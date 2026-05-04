import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { getDateLocale } from '../i18n';
import { AppTheme } from '../theme';
import { Reserva } from '../types/types';

export type LineChartRange = 'last30' | 'next30' | 'ytd' | 'next3m' | 'all';

export type RangeOption = {
  key: LineChartRange;
  label: string;
};

export type PieSliceData = {
  label: string;
  value: number;
  color: string;
  gradientCenterColor: string;
};

type LinePoint = {
  value: number;
  label: string;
};

export type LineChartDatasets = {
  confirmadas: LinePoint[];
  finalizadas: LinePoint[];
  pendientes: LinePoint[];
  canceladas: LinePoint[];
  count: number;
};

export type BarChartDataPoint = {
  value: number;
  label: string;
  fullDate: string;
  states: {
    confirmadas: number;
    finalizadas: number;
    pendientes: number;
    canceladas: number;
  };
};

export type BarChartData = BarChartDataPoint[];

const extractReservas = (payload: any): Reserva[] => {
  if (Array.isArray(payload)) return payload as Reserva[];
  if (Array.isArray(payload?.data)) return payload.data as Reserva[];
  if (Array.isArray(payload?.items)) return payload.items as Reserva[];
  if (Array.isArray(payload?.rows)) return payload.rows as Reserva[];
  if (Array.isArray(payload?.reservas)) return payload.reservas as Reserva[];
  return [];
};

const formatDateToYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatShortDate = (date: Date, locale: string) => {
  const day = date.getDate();
  const month = date.toLocaleDateString(locale, { month: 'short' });
  return `${day}\n${month}`;
};

const getReservaDateKey = (fechaReserva: string) => {
  const raw = String(fechaReserva || '');
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return '';
  return formatDateToYmd(parsed);
};

export function useAdminInfo(theme: AppTheme) {
  const { t, i18n } = useTranslation();
  const locale = getDateLocale(i18n.resolvedLanguage || i18n.language);

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(0);
  const [lineChartRange, setLineChartRange] =
    useState<LineChartRange>('last30');

  const rangeOptions: RangeOption[] = [
    { key: 'last30', label: t('adminInfoRangeLast30') },
    { key: 'next30', label: t('adminInfoRangeNext30') },
    { key: 'ytd', label: t('adminInfoRangeYtd') },
    { key: 'next3m', label: t('adminInfoRangeNext3m') },
    { key: 'all', label: t('adminInfoRangeAll') },
  ];

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoadingChart(true);
        const response = await api.get('/reserva');
        setReservas(extractReservas(response?.data));
      } catch {
        setReservas([]);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchReservas();
  }, []);

  const statusSummary = useMemo(() => {
    const counters = {
      finalizadas: 0,
      confirmadas: 0,
      pendientes: 0,
      canceladas: 0,
    };

    reservas.forEach((reserva) => {
      const normalized = String(reserva.estado || '')
        .trim()
        .toLowerCase();

      if (normalized === 'finalizada') {
        counters.finalizadas += 1;
        return;
      }

      if (normalized === 'confirmada' || normalized === 'confirmado') {
        counters.confirmadas += 1;
        return;
      }

      if (normalized === 'pendiente') {
        counters.pendientes += 1;
        return;
      }

      if (normalized === 'cancelada' || normalized === 'cancelado') {
        counters.canceladas += 1;
      }
    });

    return counters;
  }, [reservas]);

  const chartData: PieSliceData[] = [
    {
      label: t('adminInfoCompleted'),
      value: statusSummary.finalizadas,
      color: theme.success,
      gradientCenterColor: '#A87408',
    },
    {
      label: t('adminInfoConfirmed'),
      value: statusSummary.confirmadas,
      color: '#E6BD6A',
      gradientCenterColor: '#C89636',
    },
    {
      label: t('adminInfoPending'),
      value: statusSummary.pendientes,
      color: theme.warning,
      gradientCenterColor: '#D89B2F',
    },
    {
      label: t('adminInfoCancelled'),
      value: statusSummary.canceladas,
      color: theme.danger,
      gradientCenterColor: '#C93535',
    },
  ];

  const totalReservas =
    statusSummary.finalizadas +
    statusSummary.confirmadas +
    statusSummary.pendientes +
    statusSummary.canceladas;

  const visiblePieData = useMemo(
    () => chartData.filter((item) => item.value > 0),
    [chartData],
  );

  const topSlice = visiblePieData.reduce(
    (best, item) => (item.value > best.value ? item : best),
    visiblePieData[0] || { label: t('adminInfoNoData'), value: 0 },
  );

  const topSliceIndex = Math.max(
    0,
    visiblePieData.findIndex((item) => item.label === topSlice.label),
  );

  useEffect(() => {
    if (!visiblePieData.length) {
      setSelectedSliceIndex(0);
      return;
    }

    if (selectedSliceIndex >= visiblePieData.length) {
      setSelectedSliceIndex(topSliceIndex);
    }
  }, [visiblePieData.length, selectedSliceIndex, topSliceIndex]);

  const activeSlice = visiblePieData[selectedSliceIndex] || topSlice;
  const activePercentage = totalReservas
    ? Math.round((activeSlice.value / totalReservas) * 100)
    : 0;

  const lineChartDatasets = useMemo<LineChartDatasets>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counters = {
      confirmadas: new Map<string, number>(),
      finalizadas: new Map<string, number>(),
      pendientes: new Map<string, number>(),
      canceladas: new Map<string, number>(),
    };

    reservas.forEach((reserva) => {
      const key = getReservaDateKey(reserva.fecha_reserva);
      if (!key) return;

      const normalized = String(reserva.estado || '')
        .trim()
        .toLowerCase();

      let map: Map<string, number> | null = null;
      if (normalized === 'confirmada' || normalized === 'confirmado') {
        map = counters.confirmadas;
      } else if (normalized === 'finalizada') {
        map = counters.finalizadas;
      } else if (normalized === 'pendiente') {
        map = counters.pendientes;
      } else if (normalized === 'cancelada' || normalized === 'cancelado') {
        map = counters.canceladas;
      }

      if (map) {
        map.set(key, (map.get(key) || 0) + 1);
      }
    });

    const dateKeys: string[] = [];

    if (lineChartRange === 'last30') {
      for (let i = 29; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dateKeys.push(formatDateToYmd(d));
      }
    } else if (lineChartRange === 'next30') {
      for (let i = 0; i < 30; i += 1) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dateKeys.push(formatDateToYmd(d));
      }
    } else if (lineChartRange === 'next3m') {
      for (let i = 0; i < 90; i += 1) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dateKeys.push(formatDateToYmd(d));
      }
    } else if (lineChartRange === 'ytd') {
      const start = new Date(today.getFullYear(), 0, 1);
      const d = new Date(start);
      while (d <= today) {
        dateKeys.push(formatDateToYmd(d));
        d.setDate(d.getDate() + 1);
      }
    } else if (lineChartRange === 'all') {
      for (let i = 89; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dateKeys.push(formatDateToYmd(d));
      }
    }

    const total = dateKeys.length;
    const labelEvery = total <= 30 ? 5 : total <= 90 ? 10 : 30;

    const buildDaySeries = (map: Map<string, number>) =>
      dateKeys.map((key, idx) => {
        const parts = key.split('-');
        const date = new Date(
          Number(parts[0]),
          Number(parts[1]) - 1,
          Number(parts[2]),
        );
        const isLast = idx === total - 1;

        return {
          value: map.get(key) || 0,
          label:
            idx % labelEvery === 0 || isLast
              ? formatShortDate(date, locale)
              : '',
        };
      });

    return {
      confirmadas: buildDaySeries(counters.confirmadas),
      finalizadas: buildDaySeries(counters.finalizadas),
      pendientes: buildDaySeries(counters.pendientes),
      canceladas: buildDaySeries(counters.canceladas),
      count: total,
    };
  }, [locale, reservas, lineChartRange]);

  const lineChartItemSpacing =
    lineChartRange === 'last30' || lineChartRange === 'next30'
      ? 20
      : lineChartRange === 'ytd'
        ? 6
        : 8;

  const lineChartTotalWidth = lineChartDatasets.count * lineChartItemSpacing + 50;

  // CREAR BAR CHART DATA
  const barChartData = useMemo<BarChartData>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counters = {
      confirmadas: new Map<string, number>(),
      finalizadas: new Map<string, number>(),
      pendientes: new Map<string, number>(),
      canceladas: new Map<string, number>(),
    };

    reservas.forEach((reserva) => {
      const key = getReservaDateKey(reserva.fecha_reserva);
      if (!key) return;

      const normalized = String(reserva.estado || '')
        .trim()
        .toLowerCase();

      let map: Map<string, number> | null = null;
      if (normalized === 'confirmada' || normalized === 'confirmado') {
        map = counters.confirmadas;
      } else if (normalized === 'finalizada') {
        map = counters.finalizadas;
      } else if (normalized === 'pendiente') {
        map = counters.pendientes;
      } else if (normalized === 'cancelada' || normalized === 'cancelado') {
        map = counters.canceladas;
      }

      if (map) {
        map.set(key, (map.get(key) || 0) + 1);
      }
    });

    const getRangeStates = (start: Date, end: Date) => {
      const values = {
        confirmadas: 0,
        finalizadas: 0,
        pendientes: 0,
        canceladas: 0,
      };

      const cursor = new Date(start);
      cursor.setHours(0, 0, 0, 0);
      const endDate = new Date(end);
      endDate.setHours(0, 0, 0, 0);

      while (cursor <= endDate) {
        const key = formatDateToYmd(cursor);
        values.confirmadas += counters.confirmadas.get(key) || 0;
        values.finalizadas += counters.finalizadas.get(key) || 0;
        values.pendientes += counters.pendientes.get(key) || 0;
        values.canceladas += counters.canceladas.get(key) || 0;
        cursor.setDate(cursor.getDate() + 1);
      }

      return values;
    };

    const toPoint = (
      label: string,
      fullDate: string,
      states: {
        confirmadas: number;
        finalizadas: number;
        pendientes: number;
        canceladas: number;
      },
    ) => ({
      value:
        states.confirmadas +
        states.finalizadas +
        states.pendientes +
        states.canceladas,
      label,
      fullDate,
      states,
    });

    if (lineChartRange === 'ytd') {
      const year = today.getFullYear();
      const points: BarChartData = [];

      for (let month = 0; month < 12; month += 1) {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);
        const label = start.toLocaleDateString(locale, { month: 'short' });
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}`;
        points.push(toPoint(label, fullDate, getRangeStates(start, end)));
      }

      return points;
    }

    if (lineChartRange === 'next3m') {
      const points: BarChartData = [];
      const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      for (let offset = 0; offset < 3; offset += 1) {
        const monthStart = new Date(
          startMonth.getFullYear(),
          startMonth.getMonth() + offset,
          1,
        );
        const monthEnd = new Date(
          startMonth.getFullYear(),
          startMonth.getMonth() + offset + 1,
          0,
        );

        const monthLabel = monthStart.toLocaleDateString(locale, {
          month: 'short',
        });
        const daysInMonth = monthEnd.getDate();
        const monthKey = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`;

        for (let block = 0; block < 10; block += 1) {
          const startDay = Math.floor((block * daysInMonth) / 10) + 1;
          const endDay = Math.floor(((block + 1) * daysInMonth) / 10);

          if (endDay < startDay) continue;

          const blockStart = new Date(
            monthStart.getFullYear(),
            monthStart.getMonth(),
            startDay,
          );
          const blockEnd = new Date(
            monthStart.getFullYear(),
            monthStart.getMonth(),
            endDay,
          );

          const label = block === 0 ? monthLabel : '';
          const fullDate = `${monthKey}-b${String(block + 1).padStart(2, '0')}`;
          points.push(toPoint(label, fullDate, getRangeStates(blockStart, blockEnd)));
        }
      }

      return points;
    }

    const dateKeys: string[] = [];
    if (lineChartRange === 'last30') {
      for (let i = 29; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dateKeys.push(formatDateToYmd(d));
      }
    } else if (lineChartRange === 'next30') {
      for (let i = 0; i < 30; i += 1) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dateKeys.push(formatDateToYmd(d));
      }
    } else if (lineChartRange === 'all') {
      for (let i = 89; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dateKeys.push(formatDateToYmd(d));
      }
    }

    const total = dateKeys.length;
    const labelEvery =
      lineChartRange === 'last30' || lineChartRange === 'next30'
        ? 2
        : total <= 30
          ? 5
          : 10;

    return dateKeys.map((key, idx) => {
      const parts = key.split('-');
      const date = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]),
      );
      const isLast = idx === total - 1;
      const states = {
        confirmadas: counters.confirmadas.get(key) || 0,
        finalizadas: counters.finalizadas.get(key) || 0,
        pendientes: counters.pendientes.get(key) || 0,
        canceladas: counters.canceladas.get(key) || 0,
      };

      const label =
        idx % labelEvery === 0 || isLast
          ? lineChartRange === 'last30' || lineChartRange === 'next30'
            ? String(date.getDate())
            : formatShortDate(date, locale)
          : '';

      return toPoint(label, key, states);
    });
  }, [locale, reservas, lineChartRange]);

  const lineChartTotal =
    lineChartDatasets.confirmadas.reduce((acc, item) => acc + item.value, 0) +
    lineChartDatasets.finalizadas.reduce((acc, item) => acc + item.value, 0) +
    lineChartDatasets.pendientes.reduce((acc, item) => acc + item.value, 0) +
    lineChartDatasets.canceladas.reduce((acc, item) => acc + item.value, 0);

  const lineChartMaxValue = Math.max(
    ...lineChartDatasets.confirmadas.map((item) => item.value),
    ...lineChartDatasets.finalizadas.map((item) => item.value),
    ...lineChartDatasets.pendientes.map((item) => item.value),
    ...lineChartDatasets.canceladas.map((item) => item.value),
    4,
  );

  const lineChartTitle = {
    last30: t('adminInfoLineTitleLast30'),
    next30: t('adminInfoLineTitleNext30'),
    ytd: t('adminInfoLineTitleYtd'),
    next3m: t('adminInfoLineTitleNext3m'),
    all: t('adminInfoLineTitleAll'),
  }[lineChartRange];

  return {
    loadingChart,
    selectedSliceIndex,
    setSelectedSliceIndex,
    lineChartRange,
    setLineChartRange,
    rangeOptions,
    totalReservas,
    visiblePieData,
    activeSlice,
    activePercentage,
    lineChartDatasets,
    lineChartTotal,
    lineChartTotalWidth,
    lineChartItemSpacing,
    lineChartMaxValue,
    lineChartTitle,
    barChartData,
  };
}
