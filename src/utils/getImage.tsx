import { API_PUBLIC_URL } from '../constants';
import api from '../services/api';
import { Pista, PistaDisponibilidad, Reserva, TipoPista } from '../types/types';

const toImageSource = (imagen?: string): { uri: string } | undefined => {
  if (!imagen) return undefined;
  return {
    uri: `${API_PUBLIC_URL}${imagen.startsWith('/') ? '' : '/'}${imagen}`,
  };
};

export function getTipoPistaImage(
  entity: Pista | PistaDisponibilidad | Reserva,
): { uri: string } | undefined;
export function getTipoPistaImage(
  tipoPistaId: number | string,
): Promise<{ uri: string } | undefined>;
export function getTipoPistaImage(
  entityOrTipoPistaId: Pista | PistaDisponibilidad | Reserva | number | string,
): { uri: string } | undefined | Promise<{ uri: string } | undefined> {
  if (
    typeof entityOrTipoPistaId === 'number' ||
    typeof entityOrTipoPistaId === 'string'
  ) {
    return api
      .get(`/tipo_court/${entityOrTipoPistaId}`)
      .then((response) => response?.data as TipoPista | undefined)
      .then((tipoPista) => toImageSource(tipoPista?.imagen))
      .catch(() => undefined);
  }

  const entity = entityOrTipoPistaId;
  let raw: Pista | PistaDisponibilidad | undefined;

  // Si es una Reserva, bajamos al objeto pista
  if ('reserva_id' in entity) {
    raw = (entity as Reserva).pista;
  } else {
    raw = entity as Pista | PistaDisponibilidad;
  }

  const imagen = (raw as PistaDisponibilidad)?.tipo_pista?.imagen;

  console.log('Imagen---->', toImageSource(imagen));
  return toImageSource(imagen);
}
