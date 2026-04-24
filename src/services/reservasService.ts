import { API_PUBLIC_URL } from '../constants';
import { MODELOS, Modelo } from '../data/modelos';
import api from './api';

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

const BASE_URL = (globalThis as any)?.SERVER_URL || 'http://localhost:8000';

async function tryFetchJson(url: string, opts?: RequestInit) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error('network');
    return await res.json();
  } catch {
    return null;
  }
}

const normalizeModel = (item: any, idx: number): Modelo => {
  const title =
    item.nombre || item.tipo || item.title || item.name || `Pista ${idx + 1}`;
  const price =
    item.precioHora ??
    item.precio_hora ??
    item.precioDia ??
    item.precio ??
    item.price ??
    MODELOS[idx % MODELOS.length].price;

  const id = String(
    item.id ?? item._id ?? item.pistaId ?? item.tipo_pista_id ?? idx + 1,
  );
  const match = MODELOS.find((m) =>
    title.toLowerCase().includes(m.title.toLowerCase()),
  );
  const remoteImage = item.imagen || item.image || item.img;

  if (typeof remoteImage === 'string' && remoteImage.trim()) {
    const imageUrl = remoteImage.startsWith('http')
      ? remoteImage
      : `${API_PUBLIC_URL}/${remoteImage.replace(/^\//, '')}`;

    return {
      id,
      title,
      price: Number(price),
      img: { uri: imageUrl },
    } as Modelo;
  }

  return {
    id,
    title,
    price: Number(price),
    img: match ? match.img : MODELOS[idx % MODELOS.length].img,
  } as Modelo;
};

const dedupeModels = (items: Modelo[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

export const reservasService = {
  async getModelos(): Promise<Modelo[]> {
    const endpoints = ['/tipo_pista', '/tipos_pista', '/pista', '/pistas'];

    for (const ep of endpoints) {
      try {
        const res = await api.get(ep);
        const data = res?.data;
        if (Array.isArray(data)) {
          return dedupeModels(
            data.map((item: any, idx: number) => normalizeModel(item, idx)),
          );
        }
      } catch {
        // Try next endpoint/fallback.
      }
    }

    for (const ep of endpoints) {
      const data = await tryFetchJson(`${BASE_URL}${ep}`);
      if (data && Array.isArray(data)) {
        return dedupeModels(
          data.map((item: any, idx: number) => normalizeModel(item, idx)),
        );
      }
    }

    return MODELOS;
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
      pista_id: Number(input.pistaId ?? input.modeloId),
      fecha_reserva: inicio.toISOString().slice(0, 10),
      hora_inicio: inicio.toTimeString().slice(0, 5),
      hora_fin: fin.toTimeString().slice(0, 5),
      nota: input.notas ?? '',
    };

    const endpoints = ['/reserva', '/reservas', '/booking'];

    for (const ep of endpoints) {
      try {
        const res = await api.post(ep, payload);
        const json = res?.data;
        const id =
          json?.reserva_id ??
          json?.id ??
          json?.insertId ??
          json?._id ??
          Math.floor(Math.random() * 1000000).toString();
        return String(id);
      } catch {
        // Try next endpoint/fallback.
      }
    }

    const body = JSON.stringify(payload);
    for (const ep of endpoints) {
      try {
        const res = await fetch(`${BASE_URL}${ep}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
        if (!res.ok) continue;
        const json = await res.json();
        const id =
          json?.reserva_id ??
          json?.id ??
          json?.insertId ??
          json?._id ??
          Math.floor(Math.random() * 1000000).toString();
        return String(id);
      } catch {
        // Try next endpoint.
      }
    }

    throw new Error('No se pudo crear la reserva en el servidor');
  },
};
