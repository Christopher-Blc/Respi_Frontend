# 🎾 ResPi — Frontend (TFG)

Este repositorio contiene el **frontend** de nuestro TFG (**ResPi**), desarrollado por **Javi, Mauro y yo**.  
ResPi es una app móvil pensada para la **reserva de pistas** (deportivas), construida con **React Native + Expo** en **TypeScript** y organizada con **Expo Router**.

---

## 🧠 ¿Qué es ResPi?

**ResPi** es una aplicación móvil enfocada a facilitar la **gestión y reserva de pistas** desde el móvil: consultar disponibilidad, ver reservas y (más adelante) realizar reservas y gestionar usuarios de forma completa.

> ⚠️ **Estado actual:** el proyecto está **en desarrollo**.  
> De momento, el frontend incluye principalmente:
> - 🔐 **Login**
> - 📋 **Lista de reservas**
>
> Mucha parte de la funcionalidad prevista todavía está pendiente.

---

## 🚧 Coming Soon

Estamos trabajando en la siguiente fase del proyecto. Próximamente iremos añadiendo:

- 🗓️ Crear / editar / cancelar reservas
- 🔎 Búsqueda y filtrado por pistas / horarios
- 👤 Perfil de usuario y ajustes
- 🔔 Notificaciones y recordatorios
- 🧾 Mejoras de UI/UX y pantallas finales

---

## 🧰 Tecnologías

- 📱 **Expo** + **React Native**
- 🟦 **TypeScript**
- 🧭 **Expo Router**
- 🗄️ **Supabase** (`@supabase/supabase-js`)
- 🔄 **TanStack React Query** (fetching + caché)
- 🧠 **Zustand** (estado global)
- 🧪 **Axios** (peticiones HTTP cuando lo necesitamos)
- 🔐 **Expo Secure Store**
- 🔔 **Expo Notifications**
- 🎨 UI/UX: `react-native-paper`, `expo-linear-gradient`, `expo-blur`, etc.

---

## 🚀 Cómo ejecutar el proyecto

### ✅ Requisitos
- Node.js + npm
- **Expo Go** en el móvil (o emulador Android/iOS)

### 📥 Instalación
```bash
git clone https://github.com/Christopher-Blc/Respi_Frontend.git
cd Respi_Frontend
npm install
```

### ▶️ Desarrollo
```bash
npx expo start
```

Desde el menú:
- 🤖 Android: `a`
- 🍎 iOS: `i`
- 🌐 Web: `w`

---

## 🗂️ Estructura del proyecto

Las pantallas y rutas están en:

- `src/app`

Como usamos **Expo Router**, la estructura de carpetas define la navegación. Lo tenemos separado principalmente en:

### 🔑 `src/app/(login)`
Pantallas del **flujo de autenticación**.

### 🏠 `src/app/(app)`
Pantallas de la **app principal** una vez se inicia sesión.

### 📌 Archivos importantes
- `src/app/_layout.tsx` → layout / navegación base
- `src/app/index.tsx` → entrada principal
- `src/app/+not-found.tsx` → fallback de rutas

### 🧱 Carpetas de apoyo (según necesidad)
- `src/components` → componentes reutilizables
- `src/hooks` → hooks propios
- `src/services` → acceso a datos (API, supabase, etc.)
- `src/context` → contextos (si aplica)
- `src/types` → tipados y modelos
- `src/style` y/o `src/theme.ts` → estilos / tema
- `src/data` / `src/Mocks` → mocks o datos de desarrollo

---

## 🧠 Datos, estado y persistencia (cómo lo planteamos)

- 🔄 **Datos remotos** → **React Query** (caché, refetch, estados de carga/errores)
- 🧠 **Estado global** → **Zustand** para estados compartidos
- 🔐 **Persistencia segura** → **Secure Store** si guardamos datos sensibles

---

## ⚙️ Configuración (Supabase)

El frontend se conecta a **Supabase**, así que necesitamos configurar credenciales (URL y key).  
Normalmente usamos variables tipo:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

> 🚫 No subimos claves reales al repositorio.

---

## 👥 Autores

Proyecto realizado por **Javi**, **Mauro** y **Christopher** (yo), como parte del **TFG**.

---

## 📌 Nota

Este repositorio es el **frontend**. El resto del sistema (backend/servicios) se está integrando en paralelo según el avance del TFG.

---
