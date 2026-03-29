import { MODELOS, Modelo } from '../data/modelos';

type CreateInput = {
  usuarioId: string;
  email: string;
  nombre?: string;
  modeloId: number;
  precioDia: number;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  notas?: string;
};

const toDateOnly = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 0, 0, 0);
};

const calcDias = (inicio: Date, fin: Date) => {
  const diff = fin.getTime() - inicio.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
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
    // Intenta obtener modelos desde la API; si falla, devuelve los locales
    const endpoints = ['/pista', '/pistas'];
    for (const ep of endpoints) {
      const data = await tryFetchJson(`${BASE_URL}${ep}`);
      if (data && Array.isArray(data)) {
        return data.map((s: any, idx: number) => {
          const title =
            s.nombre || s.tipo || s.title || s.name || `Pista ${idx + 1}`;
          const price =
            s.precioDia ||
            s.precio ||
            s.price ||
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
    const inicio = toDateOnly(input.fechaInicio);
    const fin = toDateOnly(input.fechaFin);
    if (!inicio || !fin)
      throw new Error('Fechas inválidas (formato AAAA-MM-DD)');
    const dias = calcDias(inicio, fin);
    if (dias <= 0)
      throw new Error('La fecha de fin debe ser posterior a la de inicio');

    const body = JSON.stringify(input);
    const endpoints = ['/reserva', '/reservas', '/booking'];
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
        // continue to next endpoint
      }
    }

    // fallback: simulación local
    await new Promise((r) => setTimeout(r, 800));
    const id = Math.floor(Math.random() * 1000000).toString();
    return id;
  },
};
