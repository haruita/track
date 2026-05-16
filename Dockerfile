# Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/
RUN pnpm install --frozen-lockfile

COPY apps/frontend/ apps/frontend/
RUN pnpm --dir apps/frontend build

# Production
FROM node:22-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

# Copy workspace files and install all deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/
COPY domain/package.json domain/
RUN pnpm install --frozen-lockfile

# Copy backend source
COPY apps/backend/ apps/backend/

# Copy uploads (cover images for seed)
COPY apps/backend/uploads/ apps/backend/uploads/

# Generate Prisma Client
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Copy built frontend
COPY --from=frontend-build /app/apps/frontend/dist ./dist/frontend

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

WORKDIR /app/apps/backend

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && node --import tsx src/server.ts"]
