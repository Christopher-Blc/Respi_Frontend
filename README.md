# ResPi — Frontend (TFG)

Frontend del proyecto de TFG **ResPi**, desarrollado por **Javi, Mauro y Christopher**.  
App móvil (y web) para la **reserva y gestión de pistas deportivas**, construida con **React Native + Expo** en **TypeScript** y navegación basada en **Expo Router**.

---

## ¿Qué es ResPi?

ResPi conecta a usuarios con pistas deportivas: consultar disponibilidad, crear reservas, gestionar su perfil y membresía. Los administradores tienen su propio panel para gestionar pistas, reservas, usuarios, pagos y más.

---

## Estado actual

El frontend está **en fase avanzada de desarrollo** , estando a punto de terminarse. Las funcionalidades implementadas incluyen:

### Autenticación
- Login con JWT + refresh token automático
- Registro de nuevos usuarios
- Registro simplificado (sin campo de dirección)
- Persistencia de sesión con Expo Secure Store
- Redirección automática según rol (admin / cliente)

### App — Clientes `(tabs)`
- **Home** — resumen de actividad y accesos rápidos
- **Pistas** — catálogo de pistas con filtros y disponibilidad visual
- **Reservas** — lista de reservas propias con tarjetas de estado
  - Flujo completo de creación: selección de tipo → pista → fecha/hora/duración → confirmación
- **Perfil** — datos del usuario, membresía, idioma y modo oscuro

### App — Admin `(admin)`
- **Panel de gestión** — dashboard con accesos a todas las secciones
- **Gestión de pistas** — CRUD completo: crear, editar, borrar y poner en mantenimiento, con horarios semanales y precio por hora
- **Info / Estadísticas** — pantalla de datos del centro
- **Perfil admin**

### UI / UX global
- Modo oscuro y claro con tema centralizado (`ThemeContext`)
- Headers con efecto blur en tabs y stack screens
- Modales de confirmación y alerta reutilizables (`SessionExpiredModal`)
- Componentes de glass design (botones, inputs, logo animado)
- Mapa integrado (`respi_poli_mapa`)
- Safe area + header height gestionados en todas las pantallas

---

## Tecnologías

| Categoría | Librerías |
|---|---|
| Framework | Expo ~54, React Native 0.81, React 19 |
| Lenguaje | TypeScript ~5.9 |
| Navegación | Expo Router ~6 |
| HTTP / Auth | Axios, JWT Decode, Expo Secure Store |
| Estado | Zustand ~5 |
| UI | expo-blur, expo-linear-gradient, react-native-paper, moti, expo-image |
| Calendario | react-native-calendars, @react-native-community/datetimepicker |
| Backend | API REST propia en `https://respi.es` |
| Otras | expo-notifications, react-native-svg, react-native-webview |

---

## Ejecutar el proyecto

### Requisitos
- Node.js + npm
- Expo Go en el móvil, o emulador Android/iOS

### Instalación
```bash
git clone https://github.com/Christopher-Blc/Respi_Frontend.git
cd Respi_Frontend
npm install
```

### Desarrollo
```bash
npx expo start
```

| Tecla | Plataforma |
|---|---|
| `a` | Android |
| `i` | iOS |
| `w` | Web |

---

## Notificaciones (implementado)

La app ya incluye:
- Registro de listeners globales en `src/app/_layout.tsx`
- Servicio central de notificaciones en `src/services/notificationsService.ts`
- Pantalla de historial en `src/app/(app)/(tabs)/notifications-history.tsx` con:
  - Activación/desactivación de notificaciones
  - Historial local de notificaciones recientes

### Acceso por plataforma

- En móvil (Android/iOS): el acceso a notificaciones aparece en Perfil.
- En web: el acceso a notificaciones está oculto en Perfil.

### Cómo probar

1. Abre la app y entra en **Perfil** (móvil).
2. Pulsa **Notificaciones** para abrir el historial.
3. Activa el switch de notificaciones y concede permisos cuando se soliciten.

### Notas importantes

- Para push token real necesitas dispositivo físico (no Expo Go en algunos flujos).
- El token Expo se imprime en consola (`Expo push token: ...`) tras conceder permisos.
- En Android se crea automáticamente el canal `default` con prioridad alta.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/          # Login y registro
│   └── (app)/
│       ├── (tabs)/      # Home, Pistas, Reservas, Perfil (clientes)
│       └── (admin)/     # Panel admin + (management)/pistas
├── components/          # Componentes reutilizables (modales, botones, etc.)
├── context/             # ThemeContext, AuthContext
├── hooks/               # useReservas, useAdminPistas, useCreateBooking, etc.
├── services/            # api.ts (Axios + interceptores JWT), authStorage, reservasService
├── style/               # Estilos por pantalla
├── theme.ts             # lightTheme / darkTheme
└── types/               # Tipos globales (Pista, Reserva, etc.)
```

---

## Backend

El frontend consume una **API REST propia**, también desarrollada por el equipo como parte del TFG.  
Está desplegada en un **VPS privado** accesible en:

> `https://respi.es`

Todas las peticiones pasan por el cliente Axios (`src/services/api.ts`) con interceptores que gestionan el JWT y el refresh token automático.

---

## Build y despliegue APK

Generar APK Android:

```bash
eas build --platform android --profile preview
```

Subir APK al servidor:

```bash
scp ResPi_dev1.0.1.apk respi@respi.es:/home/respi/ProyectoApp_Acceso_A_Datos/public
```

---

## Autores

Proyecto realizado por **Javi**, **Mauro** y **Christopher**, como parte del **TFG**.

---

## Update eas

eas update --branch preview --message "Añadido login"
---

 