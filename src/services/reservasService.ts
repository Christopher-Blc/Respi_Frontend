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

export const reservasService = {
  async createReserva(input: CreateInput): Promise<string> {
    const inicio = toDateOnly(input.fechaInicio);
    const fin = toDateOnly(input.fechaFin);
    if (!inicio || !fin)
      throw new Error('Fechas inválidas (formato AAAA-MM-DD)');
    const dias = calcDias(inicio, fin);
    if (dias <= 0)
      throw new Error('La fecha de fin debe ser posterior a la de inicio');

    // Aquí en producción se llamaría a la API (Supabase o backend).
    // Por ahora simulamos creación y devolvemos un id.
    await new Promise((r) => setTimeout(r, 800));
    const id = Math.floor(Math.random() * 1000000).toString();
    return id;
  },
};
