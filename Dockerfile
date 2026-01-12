# Use Bun Alpine as the base image
FROM oven/bun:alpine AS base
WORKDIR /app

# Stage 1: Install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM base AS build
COPY . .
# Build the project
RUN bun run build

# Stage 3: Production runner
FROM oven/bun:alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Copy built assets and dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 4321

CMD ["bun", "./dist/server/entry.mjs"]
