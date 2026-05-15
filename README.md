# Track

Aplicación web para llevar un registro personal de progreso en medios como anime, videojuegos, novelas visuales, libros y más. Permite a cada usuario gestionar su propia lista de forma independiente.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite 8 + TypeScript + React-Bootstrap |
| Backend | Express 5 + Prisma + SQLite |
| Dominio | Entidades, servicios y casos de uso compartidos |
| Base de datos | SQLite (archivo local) |

## Requisitos

- Node.js 22+
- pnpm 10.32.1
- Docker y Docker Compose (opcional, para despliegue)

## Instalación y ejecución local

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Crear `apps/backend/.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu-secreto-aqui"
```

### 3. Base de datos

```bash
cd apps/backend
npx prisma db push --accept-data-loss
npx tsx prisma/seed.ts
cd ../..
```

### 4. Iniciar servicios

```bash
# Backend (puerto 3000)
pnpm --dir apps/backend dev

# Frontend (Vite HMR)
pnpm --dir apps/frontend dev
```

## Docker

```bash
docker compose up --build
```

La app queda disponible en `http://localhost:3000`. Los datos se persisten en volúmenes nombrados (`db-data`, `uploads-data`).

## Cuenta por defecto

| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@test.com` | `admin123` | ADMIN |

## Uso

### Como usuario registrado

1. Crear una cuenta desde el login
2. Explorar el catálogo y agregar medios a tu lista con el botón **"Add to list"**
3. Desde tu **Perfil** o la **página de detalle** de cada medio, registrar avance con los controles de progreso (+ / -)
4. Subir un avatar y cambiar tu nombre de usuario desde el perfil

### Como administrador

1. Iniciar sesión con la cuenta admin
2. Acceder al **Admin Panel** para crear, editar o eliminar entradas del catálogo global
3. Cada entrada incluye: título, tipo, actividad, estado, unidad de progreso, total, imagen de portada y descripción

## Estructura del proyecto

```
apps/
  frontend/       # React + Vite
  backend/        # Express + Prisma
    prisma/
      schema.prisma
      seed.ts     # Datos iniciales con 3 medios de ejemplo
domain/           # Capa de dominio (entidades, servicios, use-cases)
```

## Tests

```bash
# Dominio (Vitest)
pnpm test
pnpm test:watch

# Backend
pnpm --dir apps/backend test
pnpm --dir apps/backend test:watch
```

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/register` | Registrar usuario |
| `POST` | `/auth/login` | Iniciar sesión (devuelve JWT) |
| `GET` | `/media` | Listar catálogo (opcional `?q=` para buscar) |
| `GET` | `/media/:id` | Detalle de un medio |
| `POST` | `/media` | Crear medio (requiere ADMIN) |
| `PUT` | `/media/:id` | Editar medio (requiere ADMIN) |
| `DELETE` | `/media/:id` | Eliminar medio (requiere ADMIN) |
| `GET` | `/users/me` | Perfil del usuario autenticado |
| `GET` | `/users/me/media` | Lista de medios del usuario |
| `POST` | `/users/me/media/:mediaId` | Agregar medio a la lista |
| `PATCH` | `/users/me/media/:userMediaId/progress` | Actualizar progreso |
| `DELETE` | `/users/me/media/:userMediaId` | Quitar medio de la lista |
| `PUT` | `/users/me/avatar` | Subir avatar |
| `PATCH` | `/users/me/username` | Cambiar nombre de usuario |
