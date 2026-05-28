import { Reservation } from "./types/types";

//filtro para reservas activas (en estado confirmado)
export const reservasActivasFilter = (response: any) => (response?.data ?? []).filter(
        (reservation: Reservation) => reservation.status.toUpperCase() === 'CONFIRMADA',
      );

      export const reservasFinalizedFilter = (response: any) => (response?.data ?? []).filter(
        (reservation: Reservation) => reservation.status.toUpperCase() === 'FINALIZADA',
      );