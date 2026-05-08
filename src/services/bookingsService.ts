import { API_PUBLIC_URL } from '../constants';
import api from './api';
import { CourtType } from '../types/types';

export type Modelo = {
  id: string;
  title: string;
  price: number;
  img?: { uri: string };
};

type CreateInput = {
  usuarioId: string;
  email: string;
  nombre?: string;
  modeloId: number;
  pistaId?: number;
  precioHora: number;
  fechaInicio: string;
  fechaFin: string;
  notas?: string;
};

const calcHoras = (inicio: Date, fin: Date) => {
  const diff = fin.getTime() - inicio.getTime();
  const msHour = 1000 * 60 * 60;
  return Math.ceil(diff / msHour);
};

const normalizeModel = (item: CourtType, idx: number): Modelo => {
  const id = String(item.id ?? idx + 1);
  const title = item.name || `Pista ${idx + 1}`;
  const firstCourtPrice = Number(item.courts?.[0]?.price_per_hour ?? 0);
  const image = item.image;
  const imageUrl =
    typeof image === 'string' && image.trim().length > 0
      ? image.startsWith('http')
        ? image
        : `${API_PUBLIC_URL}${image.startsWith('/') ? '' : '/'}${image}`
      : undefined;

  return {
    id,
    title,
    price: Number.isFinite(firstCourtPrice) ? firstCourtPrice : 0,
    img: imageUrl ? { uri: imageUrl } : undefined,
  };
};

const dedupeModels = (items: Modelo[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

export const bookingsService = {
  async getModelos(): Promise<Modelo[]> {
    try {
      const res = await api.get('/tipo_court');
      const data = res?.data;
      if (!Array.isArray(data)) return [];
      return dedupeModels(
        (data as CourtType[]).map((item, idx) => normalizeModel(item, idx)),
      );
    } catch {
      return [];
    }
  },

  async createReserva(input: CreateInput): Promise<string> {
    const inicio = new Date(input.fechaInicio);
    const fin = new Date(input.fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      throw new Error('Fechas invalidas (formato ISO datetime)');
    }

    const horas = calcHoras(inicio, fin);
    if (horas <= 0) {
      throw new Error('La fecha de fin debe ser posterior a la de inicio');
    }

    const payload = {
      court_id: Number(input.pistaId ?? input.modeloId),
      reservation_date: inicio.toISOString().slice(0, 10),
      start_time: inicio.toTimeString().slice(0, 5),
      end_time: fin.toTimeString().slice(0, 5),
      note: input.notas ?? '',
    };

    try {
      const res = await api.post('/Reservation', payload);
      const json = res?.data;
      const id =
        json?.id ??
        json?.reservation_id ??
        json?.reserva_id ??
        json?.insertId ??
        json?._id ??
        Math.floor(Math.random() * 1000000).toString();
      return String(id);
    } catch {
      throw new Error('No se pudo crear la reserva en el servidor');
    }
  },
};
