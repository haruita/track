# AGENTS.md

## Project Overview

Monorepo-style project managed with **pnpm@10.32.1**. Three packages:

| Package | Path | Stack |
|---------|------|-------|
| Frontend | `apps/frontend/` | React 19 + Vite 8 + TypeScript + React-Bootstrap |
| Backend | `apps/backend/` | Express 5 + Prisma + SQLite |
| Domain | `domain/` | Shared domain layer (entities, repos, services, use-cases) |

## Developer Commands

Run from the **package directory** (not root):

- **Frontend**: `pnpm dev` (Vite HMR), `pnpm build` (tsc -b && vite build), `pnpm lint`
- **Backend**: `pnpm dev` (tsx watch, port 3000)
- **Domain**: `pnpm test` (vitest), `pnpm test:watch`

Root-level `pnpm dev` → backend, `pnpm test` / `pnpm test:watch` → domain. Uses `pnpm --dir` (not `--filter`) since there's no `pnpm-workspace.yaml`.

## Backend

- Entry: `apps/backend/src/server.ts` -> `app.ts`
- Routes: `/auth`, `/users`, `/media`
- Prisma: `apps/backend/prisma/schema.prisma` (SQLite, `dev.db`)
- Env: `apps/backend/.env` — `DATABASE_URL` and `JWT_SECRET`
- After schema changes: `npx prisma generate` then `npx prisma migrate dev`
- Custom types: `apps/backend/src/types/` (via `typeRoots` in tsconfig)
- JWT payload includes `role` as **uppercase** Prisma enum value (`"ADMIN"`, `"USER"`)

## Domain Layer

- Exports: `domain/src/index.ts` re-exports entities
- Structure: `entities/`, `repositories/`, `services/`, `use-cases/`
- Tests: Vitest with `globals: true` (no imports needed for `describe`/`it`/`expect`)

## Frontend

- Entry: `apps/frontend/src/main.tsx`
- API client: `apps/frontend/src/api/client.ts` — axios, baseURL `http://localhost:3000`, attaches JWT from localStorage
- Auth state: token stored in `localStorage` as `"token"`

## Testing

- Only **domain** has tests configured (`domain/vitest.config.ts`)
- No test setup for frontend or backend

## Notes

- Each app has its own `pnpm-lock.yaml` and `node_modules/` (not a unified pnpm workspace)
- No CI/CD, pre-commit hooks, or Makefile
- Root `.gitignore` only excludes `/node_modules`; backend `.gitignore` also excludes `.env` and Prisma generated client
