// ─── Installation ────────────────────────────────────────────────
export interface Installation {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  created_at: string;
  status?: 'activa' | 'inactiva';
  maxCapacity?: number | null;
  openingHours?: string | null;
  closingHours?: string | null;
  courts?: Court[];
}

// ─── CourtType (tipo_court) ───────────────────────────────────────
export interface CourtType {
  id: number;
  name: string;
  image: string;
  courts?: Court[];
}

// ─── Court (/Court) ───────────────────────────────────────────────
export interface Court {
  id: number;
  installation_id: number;
  court_type_id: number;
  name: string;
  capacity: number;
  price_per_hour: string;
  is_covered: boolean;
  has_lighting: boolean;
  description: string;
  status: 'DISPONIBLE' | 'MANTENIMIENTO' | 'INACTIVA';
  opening_time: string;
  closing_time: string;
  day_of_week: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';
  reservations_made?: number;
  maintenance_from?: string | null;
  maintenance_until?: string | null;
  email_verified?: boolean;
  // Relations
  installation?: Installation;
  courtType?: CourtType;
}

// ─── CourtAvailability (/Court/disponibilidad) ───────────────────
export interface CourtAvailability extends Court {
  current_reservations: Array<{ start: string; end: string }>;
}

// ─── User (/users, /users/profile/me) ────────────────────────────
export interface User {
  id: number;
  membership_id: number | null;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'CLIENTE';
  is_active: boolean;
  email_verified?: boolean;
  registration_date: string;
  last_login_date: string;
  date_of_birth: string;
  address: string;
  refresh_token_hash?: string;
  expoPushToken?: string | null;
  membership?: Membership | null;
  total_reservations?: number;
}

// ─── Membership (/memberships) ───────────────────────────────────
export interface Membership {
  id: number;
  level: number;
  name: string;
  discount: number;
  required_reservations: number;
  benefits: string;
}

// ─── Payment ─────────────────────────────────────────────────────
export interface Payment {
  id: number;
  reservation_id: number;
  amount: string;
  payment_date: string;
  payment_method: string;
  payment_status: string;
  note: string;
}

// ─── Reservation (/Reservation, /Reservation/mis-reservas) ───────
export interface Reservation {
  id: number;
  user_id: number;
  court_id: number;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: 'FINALIZADA' | 'PENDIENTE' | 'CANCELADA' | 'CONFIRMADA';
  total_price: string;
  createdAt: string;
  note: string;
  // Relations
  user?: User;
  court?: Court;
  payments?: Payment[];
}

// ─── Notification ─────────────────────────────────────────────────
export interface Notification {
  id: number;
  user_id: number;
  title: string | null;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  user?: User;
}

// ─── JWT ─────────────────────────────────────────────────────────
export interface JWTPayload {
  sub: number;
  email: string;
  role: 'SUPER_ADMIN' | 'CLIENTE';
}

// ─── Frontend-only types ─────────────────────────────────────────
export type DatePickerMode = 'date' | 'time' | null;

export type BookingCourtOption = {
  id: string;
  name: string;
  openingHour?: string;
  closingHour?: string;
  status?: string;
  pricePerHour?: number;
  courtTypeId?: string;
};

export type WeeklyScheduleItem = {
  day_of_week: Court['day_of_week'];
  opening_time: string;
  closing_time: string;
  price_per_hour: string;
  closed: boolean;
};

export type CourtFormData = {
  name: string;
  description: string;
  capacity: string;
  is_covered: boolean;
  has_lighting: boolean;
  status: string;
  day_of_week: Court['day_of_week'];
  installation_id: string;
  court_type_id: string;
};
