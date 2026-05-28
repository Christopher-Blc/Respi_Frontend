import { API_PUBLIC_URL } from '../constants';
import api from '../services/api';
import {
  Court,
  CourtAvailability,
  Reservation,
  CourtType,
} from '../types/types';

const toImageSource = (imagen?: string): { uri: string } | undefined => {
  if (!imagen) return undefined;
  return {
    uri: `${API_PUBLIC_URL}${imagen.startsWith('/') ? '' : '/'}${imagen}`,
  };
};

export function getTipoPistaImage(
  entity: Court | CourtAvailability | Reservation,
): { uri: string } | undefined;
export function getTipoPistaImage(
  tipoPistaId: number | string,
): Promise<{ uri: string } | undefined>;
export function getTipoPistaImage(
  entityOrTipoPistaId:
    | Court
    | CourtAvailability
    | Reservation
    | number
    | string,
): { uri: string } | undefined | Promise<{ uri: string } | undefined> {
  if (
    typeof entityOrTipoPistaId === 'number' ||
    typeof entityOrTipoPistaId === 'string'
  ) {
    return api
      .get(`/court-types/${entityOrTipoPistaId}`)
      .then((response) => response?.data as CourtType | undefined)
      .then((courtType) => toImageSource(courtType?.image))
      .catch(() => undefined);
  }

  const entity = entityOrTipoPistaId;
  let raw: Court | CourtAvailability | undefined;

  // Si es una Reservation, bajamos al objeto court
  if ('reservation_date' in entity) {
    raw = (entity as Reservation).court;
  } else {
    raw = entity as Court | CourtAvailability;
  }

  const imagen = raw?.image || raw?.courtType?.image;

  return toImageSource(imagen);
}
