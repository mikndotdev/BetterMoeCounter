FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV APP_PORT=3000

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/assets ./assets
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 bunuser && \
    chown -R bunuser:nodejs /app

USER bunuser

EXPOSE 3000

CMD ["bun", "run", "start"]
