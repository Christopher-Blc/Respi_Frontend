type ValueOf<T> = T[keyof T];

export const ROUTES = {
  auth: {
    login: '/(auth)/login',
    register: '/(auth)/register',
    forgotPassword: '/(auth)/forgot-password',
    confirmEmail: '/(auth)/confirm-email',
  },
  admin: {
    root: '/(app)/(admin)',
    index: '/(app)/(admin)/index',
    info: '/(app)/(admin)/info',
    profile: '/(app)/(admin)/profile',
    pagos: '/(app)/(admin)/pagos',
    membresias: '/(app)/(admin)/membresias',
    notificaciones: '/(app)/(admin)/notificaciones',
    management: {
      root: '/(app)/(admin)/(management)',
      index: '/(app)/(admin)/(management)/index',
      courts: '/(app)/(admin)/(management)/courts',
      courtTypes: '/(app)/(admin)/(management)/court-types',
      installations: '/(app)/(admin)/(management)/installations',
      membership: '/(app)/(admin)/(management)/membership',
      reservations: '/(app)/(admin)/(management)/reservations',
      users: '/(app)/(admin)/(management)/users',
      validarReserva: '/(app)/(admin)/(management)/validar-reserva',
      reviews: '/(app)/(admin)/(management)/reviews',
      notifications: '/(app)/(admin)/(management)/notifications',
    },
  },
  userTabs: {
    root: '/(app)/(tabs)',
    index: '/(app)/(tabs)',
    courts: '/(app)/(tabs)/courts',
    profile: '/(app)/(tabs)/profile',
    reviews: '/(app)/(tabs)/reviews',
    notificationsHistory: '/(app)/(tabs)/notifications-history',
    bookings: {
      root: '/(app)/(tabs)/bookings',
      index: '/(app)/(tabs)/bookings',
      create: '/(app)/(tabs)/bookings/createBooking',
      courtTypes: '/(app)/(tabs)/bookings/courtTypes',
      confirmation: '/(app)/(tabs)/bookings/confirmation',
    },
  },
} as const;

export type AppRoute =
  | '/'
  | ValueOf<typeof ROUTES.auth>
  | ValueOf<Omit<typeof ROUTES.admin, 'management'>>
  | ValueOf<typeof ROUTES.admin.management>
  | ValueOf<Omit<typeof ROUTES.userTabs, 'bookings'>>
  | ValueOf<typeof ROUTES.userTabs.bookings>;