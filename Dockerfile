# Dockerfile for Gadget Repairs Glasgow backend (Render)
# Multi-stage build: bun for install/build, node for runtime

FROM oven/bun:1.3 AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run db:generate
RUN bun run build

# ---- Runner (Node.js — has npx, prisma deps, etc.) ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy standalone Next.js output + full node_modules (for prisma)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Push schema to DB then start server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node server.js"]
