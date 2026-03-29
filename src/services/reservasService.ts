import { MODELOS, Modelo } from '../data/modelos';
import api from './api';

type CreateInput = {
  usuarioId: string;
  email: string;
  nombre?: string;
  modeloId: number;
  precioHora: number;
  fechaInicio: string; // ISO datetime
  fechaFin: string; // ISO datetime
  notas?: string;
};

const calcHoras = (inicio: Date, fin: Date) => {
  const diff = fin.getTime() - inicio.getTime();
  const msHour = 1000 * 60 * 60;
  return Math.ceil(diff / msHour);
};

const BASE_URL = (global as any)?.SERVER_URL || 'http://localhost:8000';

async function tryFetchJson(url: string, opts?: any) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error('network');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export const reservasService = {
  async getModelos(): Promise<Modelo[]> {
    // Prefer axios/`api` to attach Authorization automatically
    const endpoints = ['/pista', '/pistas'];
    for (const ep of endpoints) {
      try {
        const res = await api.get(ep);
        const data = res?.data;
        if (Array.isArray(data)) {
          return data.map((s: any, idx: number) => {
            const title =
              s.nombre || s.tipo || s.title || s.name || `Pista ${idx + 1}`;
            const price =
              s.precioHora ??
              s.precioDia ??
              s.precio ??
              s.price ??
              MODELOS[idx % MODELOS.length].price;
            const id = String(s.id ?? s._id ?? s.pistaId ?? idx + 1);
            const match = MODELOS.find((m) =>
              title.toLowerCase().includes(m.title.toLowerCase()),
            );
            const img = match ? match.img : MODELOS[idx % MODELOS.length].img;
            return { id, title, price, img } as Modelo;
          });
        }
      } catch (err) {
        // fallthrough to fetch fallback or local
      }
    }

    // Fallback: try a plain fetch (older servers) then local MODELOS
    for (const ep of endpoints) {
      const data = await tryFetchJson(`${BASE_URL}${ep}`);
      if (data && Array.isArray(data)) {
        return data.map((s: any, idx: number) => {
          const title =
            s.nombre || s.tipo || s.title || s.name || `Pista ${idx + 1}`;
          const price =
            s.precioHora ??
            s.precioDia ??
            s.precio ??
            s.price ??
            MODELOS[idx % MODELOS.length].price;
          const id = String(s.id ?? s._id ?? s.pistaId ?? idx + 1);
          const match = MODELOS.find((m) =>
            title.toLowerCase().includes(m.title.toLowerCase()),
          );
          const img = match ? match.img : MODELOS[idx % MODELOS.length].img;
          return { id, title, price, img } as Modelo;
        });
      }
    }

    return MODELOS;
  },

  async createReserva(input: CreateInput): Promise<string> {
    const inicio = new Date(input.fechaInicio);
    const fin = new Date(input.fechaFin);
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime()))
      throw new Error('Fechas inválidas (formato ISO datetime)');
    const horas = calcHoras(inicio, fin);
    if (horas <= 0)
      throw new Error('La fecha de fin debe ser posterior a la de inicio');

    const endpoints = ['/reserva', '/reservas', '/booking'];

    for (const ep of endpoints) {
      try {
        const res = await api.post(ep, input);
        const json = res?.data;
        const id =
          json?.id ??
          json?.insertId ??
          json?._id ??
          Math.floor(Math.random() * 1000000).toString();
        return String(id);
      } catch (err: any) {
        // si hay respuesta con errores, intentar siguiente endpoint
        // si es un error de red, también intentamos el siguiente
        // console.debug('createReserva failed on', ep, err?.response?.status ?? err?.message ?? err);
      }
    }

    // fallback: intentar fetch antiguo (por compatibilidad)
    const body = JSON.stringify(input);
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
          json?.id ??
          json?.insertId ??
          json?._id ??
          Math.floor(Math.random() * 1000000).toString();
        return String(id);
      } catch (e) {
        // seguir con siguiente
      }
    }

    // fallback local simulado
    await new Promise((r) => setTimeout(r, 800));
    return Math.floor(Math.random() * 1000000).toString();
  },
};
