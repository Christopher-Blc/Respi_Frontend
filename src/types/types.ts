// 1. Tipo para el Usuario (Relacionado)
export interface User {
  usuario_id: number;
  membresia_id: number | null;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'; // Ajusta según tus roles
  isActive: boolean;
  fecha_registro: string; // O Date, dependiendo de cómo manejes el parseo
  fecha_ultimo_login: string;
  fecha_nacimiento: string;
  direccion: string;
  refresh_token_hash: string;
}



//objeto que devuelve el backend de la pista con relaciones
export type Pista = {
  pista_id: number ,
  instalacion_id: number | string,
  tipo_pista_id: number | string,
  nombre: string,
  capacidad: number,
  precio_hora: string,
  cubierta: boolean,
  iluminacion: boolean,
  descripcion: string,
  estado: string,
  mantenimiento_desde?: string | null,
  mantenimiento_hasta?: string | null,
  hora_apertura: string,
  hora_cierre: string,
  dia_semana: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO',
  instalacion: {
    instalacion_id: number,
    nombre: string,
    direccion: string,
    telefono: string,
    email: string,
    descripcion: string,
    fecha_creacion: string,
    estado: string
  }, 
};

// 3. Tipo para el Pago
export interface Pago {
  pago_id: number;
  reserva_id: number;
  monto: string;
  fecha_pago: string;
  metodo_pago: string;
  estado_pago: string;
  nota: string;
}

// 4. La Entidad Principal: Reserva
export interface Reserva {
  reserva_id: number;
  usuario_id: number;
  pista_id: number;
  fecha_reserva: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'FINALIZADA' | 'PENDIENTE' | 'CANCELADA';
  precio_total: string;
  fecha_creacion: string;
  nota: string;
  
  // Relaciones (Opcionales si no siempre haces el "relations")
  usuario?: User; 
  pista?: Pista;
  pagos?: Pago[];
}

export interface TipoPista {
  tipo_pista_id: number;
  nombre: string; 
  imagen: string; 
}

export interface Membresia {
  membresia_id: number;
  rango: string;
  tipo: string;
  descuento: number;
  reservas_requeridas: number;
  beneficios: string;
}

//objeto que devuelve el endpoint /pista/disponibilidad
export type PistaDisponibilidad = {

  pista_id: number | string,
  instalacion_id: number | string,
  tipo_pista_id: number | string,
  nombre: string,
  capacidad: number,
  precio_hora: number,
  cubierta: boolean,
  iluminacion: boolean,
  descripcion: string,
  estado: 'DISPONIBLE',
  hora_apertura: string,
  hora_cierre: string,
  dia_semana: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO',
  tipo_pista: {
    tipo_pista_id: number | string,
    nombre: string,
    imagen: string
  },
  reservas_actuales: Array<{ inicio: string; fin: string }>
  
};

export interface JWTPayload {
  sub: number;
  email: string;
  role: 'SUPER_ADMIN' | 'CLIENTE';
}