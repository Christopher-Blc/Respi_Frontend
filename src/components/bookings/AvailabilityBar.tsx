import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CourtAvailability } from '../../types/types';
import { useAppTheme } from '../../context/ThemeContext';
import createAvailabilityBarStyles from '../../style/availabilityBar.styles';

type ReservaActual = CourtAvailability['current_reservations'][number];

export type BloqueDisponibilidad = {
  tipo: 'libre' | 'ocupado';
  inicio: string;
  fin: string;
  inicioMin: number;
  finMin: number;
};

type AvailabilityBarProps = {
  horaApertura: string;
  horaCierre: string;
  reservasActuales: ReservaActual[];
  onPressBloqueLibre?: (bloque: BloqueDisponibilidad) => void;
};

const parseTimeToMinutes = (value: string) => {
  const raw = String(value || '').trim();
  if (!raw) return NaN;

  const timePart = raw.includes('T') ? raw.split('T')[1] : raw;
  const normalized = timePart.replace('Z', '').slice(0, 8);
  const parts = normalized.split(':');
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return NaN;
  return hours * 60 + minutes;
};

const toHourLabel = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
};

const formatHourTick = (minutes: number) =>
  String(Math.floor(minutes / 60)).padStart(2, '0');

const mergeReservas = (
  reservas: Array<{ inicio: number; fin: number }>,
  apertura: number,
  cierre: number,
) => {
  const clamped = reservas
    .map((reserva) => ({
      inicio: Math.max(apertura, reserva.inicio),
      fin: Math.min(cierre, reserva.fin),
    }))
    .filter((reserva) => reserva.fin > reserva.inicio)
    .sort((a, b) => a.inicio - b.inicio);

  if (clamped.length === 0) return [];

  const merged: Array<{ inicio: number; fin: number }> = [clamped[0]];

  for (let i = 1; i < clamped.length; i++) {
    const current = clamped[i];
    const last = merged[merged.length - 1];

    if (current.inicio <= last.fin) {
      last.fin = Math.max(last.fin, current.fin);
    } else {
      merged.push({ inicio: current.inicio, fin: current.fin });
    }
  }

  return merged;
};

export const crearBloquesDisponibilidad = (
  horaApertura: string,
  horaCierre: string,
  reservasActuales: ReservaActual[],
): BloqueDisponibilidad[] => {
  const aperturaMin = parseTimeToMinutes(horaApertura);
  const cierreMin = parseTimeToMinutes(horaCierre);

  if (
    Number.isNaN(aperturaMin) ||
    Number.isNaN(cierreMin) ||
    cierreMin <= aperturaMin
  ) {
    return [];
  }

  const reservasNormalizadas = (reservasActuales || [])
    .map((reserva) => ({
      inicio: parseTimeToMinutes(reserva?.start),
      fin: parseTimeToMinutes(reserva?.end),
    }))
    .filter(
      (reserva) => !Number.isNaN(reserva.inicio) && !Number.isNaN(reserva.fin),
    );

  const reservasMerged = mergeReservas(
    reservasNormalizadas,
    aperturaMin,
    cierreMin,
  );

  const bloques: BloqueDisponibilidad[] = [];
  let cursor = aperturaMin;

  for (const reserva of reservasMerged) {
    if (reserva.inicio > cursor) {
      bloques.push({
        tipo: 'libre',
        inicio: toHourLabel(cursor),
        fin: toHourLabel(reserva.inicio),
        inicioMin: cursor,
        finMin: reserva.inicio,
      });
    }

    bloques.push({
      tipo: 'ocupado',
      inicio: toHourLabel(reserva.inicio),
      fin: toHourLabel(reserva.fin),
      inicioMin: reserva.inicio,
      finMin: reserva.fin,
    });

    cursor = reserva.fin;
  }

  if (cursor < cierreMin) {
    bloques.push({
      tipo: 'libre',
      inicio: toHourLabel(cursor),
      fin: toHourLabel(cierreMin),
      inicioMin: cursor,
      finMin: cierreMin,
    });
  }

  return bloques;
};

export const crearResumenHuecosLibres = (bloques: BloqueDisponibilidad[]) => {
  const libres = bloques.filter((bloque) => bloque.tipo === 'libre');
  if (libres.length === 0) return 'No hay huecos libres en este dia';

  const texto = libres
    .map((bloque) => 'de ' + bloque.inicio + ' a ' + bloque.fin)
    .join(' y ');

  return 'Disponible ' + texto;
};

export default function AvailabilityBar({
  horaApertura,
  horaCierre,
  reservasActuales,
  onPressBloqueLibre,
}: AvailabilityBarProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createAvailabilityBarStyles(theme), [theme]);

  const bloques = useMemo(
    () =>
      crearBloquesDisponibilidad(horaApertura, horaCierre, reservasActuales),
    [horaApertura, horaCierre, reservasActuales],
  );

  const hourTicks = useMemo(() => {
    const aperturaMin = parseTimeToMinutes(horaApertura);
    const cierreMin = parseTimeToMinutes(horaCierre);
    if (
      Number.isNaN(aperturaMin) ||
      Number.isNaN(cierreMin) ||
      cierreMin <= aperturaMin
    ) {
      return [] as number[];
    }

    const ticks: number[] = [];
    let current = Math.ceil(aperturaMin / 60) * 60;

    while (current <= cierreMin) {
      ticks.push(current);
      current += 60;
    }

    return ticks;
  }, [horaApertura, horaCierre]);

  return (
    <View>
      <View style={styles.ruleRow}>
        {hourTicks.map((tick) => (
          <Text key={tick} style={styles.ruleText}>
            {formatHourTick(tick)}
          </Text>
        ))}
      </View>

      <View style={styles.barContainer}>
        {bloques.map((bloque, index) => {
          const duration = Math.max(1, bloque.finMin - bloque.inicioMin);
          const isLibre = bloque.tipo === 'libre';

          return (
            <Pressable
              key={
                bloque.tipo +
                '-' +
                bloque.inicio +
                '-' +
                bloque.fin +
                '-' +
                String(index)
              }
              disabled={!isLibre}
              onPress={() => onPressBloqueLibre?.(bloque)}
              style={[
                styles.block,
                { flex: duration },
                isLibre ? styles.blockLibre : styles.blockOcupado,
              ]}
            />
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendLibre]} />
          <Text style={styles.legendText}>Libre</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendOcupado]} />
          <Text style={styles.legendText}>Ocupado</Text>
        </View>
      </View>
    </View>
  );
}
