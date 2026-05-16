# Track

Aplicación web para llevar un registro personal de progreso en medios como anime, videojuegos, novelas visuales, libros y más. Cada usuario gestiona su propia lista de forma independiente.

## Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite + TypeScript + React-Bootstrap |
| Backend | Express + Prisma + SQLite |
| Dominio | Entidades, servicios y casos de uso compartidos |

## Prerrequisitos

1. Node.js
2. pnpm
3. Docker/Docker Compose

## Instalación

1. **Cloná el repositorio:**
    ```bash
    https://github.com/haruita/track.git
    cd track
    ```

2. **Instalá las dependencias:**
    ```bash
    pnpm install
    ```

3. **Construí y levantá todo:**
    ```bash
    pnpm docker:up
    ```

Disponible en `http://localhost:3000`. Los datos persisten en volúmenes `db-data` y `uploads-data`.

## Cuenta por defecto

| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@test.com` | `admin123` | ADMIN |

## Instrucciones de uso

### Usuario registrado

1. Crear cuenta desde el login
2. Explorar el catálogo y agregar medios con **"Add to list"**
3. Desde el **Perfil** o la **página de detalle**, registrar avance con los controles (+ / -)
4. Subir avatar y cambiar nombre de usuario desde el perfil

### Administrador

1. Iniciar sesión con la cuenta de administrador
2. Acceder al **Admin Panel** para crear, editar o eliminar entradas del catálogo
3. Cada entrada incluye: título, tipo, actividad, estado, unidad de progreso, total, imagen y descripción

## Tests

```bash
pnpm test              # Dominio
pnpm test:watch        # Dominio (watch)
pnpm test:all          # Dominio + Backend
pnpm test:backend      # Solo Backend
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/register` | Registrar usuario |
| `POST` | `/auth/login` | Iniciar sesión (devuelve JWT) |
| `GET` | `/media` | Listar catálogo |
| `GET` | `/media/:id` | Detalle de un medio |
| `POST` | `/media` | Crear medio (ADMIN) |
| `PUT` | `/media/:id` | Editar medio (ADMIN) |
| `DELETE` | `/media/:id` | Eliminar medio (ADMIN) |
| `GET` | `/users/me` | Perfil del usuario |
| `GET` | `/users/me/media` | Lista de medios del usuario |
| `POST` | `/users/me/media/:mediaId` | Agregar medio a la lista |
| `PATCH` | `/users/me/media/:userMediaId/progress` | Actualizar progreso |
| `DELETE` | `/users/me/media/:userMediaId` | Quitar medio de la lista |
| `PUT` | `/users/me/avatar` | Subir avatar |
| `PATCH` | `/users/me/username` | Cambiar nombre |
