import { Reserva } from "./types/types";

//filtro para reservas activas (en estado confirmado)
export const reservasActivasFilter = (response: any) => response.data.filter(
        (reserva: Reserva) => reserva.estado.toLowerCase() === 'confirmada',
      );

      export const reservasFinalizedFilter = (response: any) => response.data.filter(
        (reserva: Reserva) => reserva.estado.toLowerCase() === 'finalizada',
      );