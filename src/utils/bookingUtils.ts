import { BloqueDisponibilidad } from '../components/bookings/AvailabilityBar';

export const getNext7Days = (): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

export const sameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export const normalizeDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);

export const addHours = (date: Date, hours: number) => {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
};

export const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (date: Date, locale: string) =>
  date.toLocaleDateString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

export const formatCompactHour = (hhmm: string): string => {
  const [hRaw = '0', mRaw = '0'] = String(hhmm || '').split(':');
  const h = String(Number(hRaw));
  const m = Number(mRaw);
  return m === 0 ? h : `${h}:${String(m).padStart(2, '0')}`;
};

export const buildFreeRanges = (bloques: BloqueDisponibilidad[]): string[] =>
  bloques
    .filter((b) => b.tipo === 'libre' && b.finMin > b.inicioMin)
    .map((b) => `${formatCompactHour(b.inicio)} - ${formatCompactHour(b.fin)}`);
