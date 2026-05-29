import { Court, CourtFormData, WeeklyScheduleItem } from '../../types/types';

export const WEEK_DAYS: Court['day_of_week'][] = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO',
];

export const DEFAULT_FORM: CourtFormData = {
  name: '',
  description: '',
  capacity: '4',
  is_covered: false,
  has_lighting: false,
  status: 'DISPONIBLE',
  day_of_week: 'LUNES',
  installation_id: '1',
  court_type_id: '1',
};

export const createDefaultWeeklySchedule = (): WeeklyScheduleItem[] =>
  WEEK_DAYS.map((day) => ({
    day_of_week: day,
    opening_time: '08:00',
    closing_time: '22:00',
    price_per_hour: '',
    closed: false,
  }));

// --- Hour helpers ---

const HOUR_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const isValidHour = (value: string) => HOUR_PATTERN.test(value.trim());

export const hourToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

export const isValidPrice = (value: string) => {
  const normalized = value.trim().replace(',', '.');
  const amount = Number(normalized);
  return normalized.length > 0 && Number.isFinite(amount) && amount > 0;
};

// --- Date helpers ---

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateInput = (value: string): Date | null => {
  const match = DATE_PATTERN.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) return null;
  return date;
};

export const eachDateInclusive = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  while (current <= end) {
    dates.push(toDateInputValue(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const countUniqueReservas = (results: any[]): number => {
  const ids = new Set<number>();
  results.forEach((response) => {
    const rows = Array.isArray(response?.data) ? response.data : [];
    rows.forEach((reserva: any) => {
      const id = Number(reserva?.reserva_id);
      if (Number.isFinite(id)) ids.add(id);
    });
  });
  return ids.size;
};
