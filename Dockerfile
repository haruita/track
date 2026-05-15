# Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

COPY apps/frontend/package.json apps/frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY apps/frontend/ ./
RUN pnpm build

# Build backend
FROM node:22-alpine AS backend-build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

COPY apps/backend/package.json apps/backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY apps/backend/ ./
RUN npx prisma generate

# Production
FROM node:22-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

# Copy backend package files and install deps
COPY apps/backend/package.json apps/backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy backend source
COPY apps/backend/ ./

# Generate Prisma Client
RUN npx prisma generate

# Copy built frontend
COPY --from=frontend-build /app/dist ./dist/frontend

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && node --import tsx src/server.ts"]
