export type ReservationsDto = {
  //pista_id: MOCK_PISTA.id,
  pista_id: number,
  fecha_reserva: string,
  hora_inicio: string,
  hora_fin: string,
  nota: string
};

export type ReservationsInformation = {
  //pista_id: MOCK_PISTA.id,
  pista_id: number,
  fecha_reserva: string,
  hora_inicio: string,
  hora_fin: string,
  nota: string
};

/**
 * Mock de respuesta para una Reserva Completa
 * Incluye relaciones cargadas (Usuario, Pista y Pagos)
 */
export type ReservaDetalles = {
  reserva_id: 1,
  usuario_id: 1,
  pista_id: 1,
  fecha_reserva: "2025-01-10T00:00:00.000Z",
  hora_inicio: "10:00:00",
  hora_fin: "12:00:00",
  estado: "FINALIZADA",
  precio_total: "31.00",
  fecha_creacion: "2026-04-13T08:13:36.000Z",
  nota: "Reserva para historial (Bronce)",

  // Objeto del Usuario que realizó la reserva
  usuario: {
    usuario_id: 1,
    membresia_id: null,
    username: "ResPi",
    name: "test",
    surname: "test",
    email: "test@test.com",
    phone: "634323242",
    role: "SUPER_ADMIN",
    isActive: true,
    fecha_registro: "2025-10-23T00:00:00.000Z",
    fecha_ultimo_login: "2026-04-13T08:42:03.000Z",
    fecha_nacimiento: "2007-10-23",
    direccion: "C/ Casa al costat de la de Carolina",
    refresh_token_hash: "$2b$10$0LKI5HdbwMn2ocgEnLW/SetXYOFqrWoNQKbxsS3.a9iXarjHsmxOq"
  },

  // Objeto de la Pista reservada
  pista: {
    pista_id: 1,
    instalacion_id: 1,
    tipo_pista_id: 1,
    nombre: "Pista Central Tenis",
    capacidad: 4,
    precio_hora: "15.50",
    cubierta: true,
    iluminacion: true,
    descripcion: "Pista de tenis con iluminación nocturna y superficie rápida.",
    estado: "DISPONIBLE",
    hora_apertura: "08:00:00",
    hora_cierre: "22:00:00",
    dia_semana: "LUNES"
  },

  // Array de pagos asociados
  pagos: [
    {
      pago_id: 1,
      reserva_id: 1,
      monto: "150.75",
      fecha_pago: "2025-11-01T09:30:00.000Z",
      metodo_pago: "Visa",
      estado_pago: "Pagado",
      nota: "Pago realizado con éxito"
    }
  ]
};