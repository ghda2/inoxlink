FROM oven/bun:alpine AS base
WORKDIR /app

# Stage 1: Install dependencies
# Copiamos apenas os arquivos de lock e package primeiro para aproveitar o cache de camadas
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM base AS build
# Copiamos o restante dos arquivos
COPY . .
# Build otimizado do Astro
RUN bun run build

# Stage 3: Production runner
FROM oven/bun:alpine AS runner
WORKDIR /app

# Definimos as variáveis de ambiente antes para que o runtime as utilize
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Camada de produção: Copiamos apenas o necessário para rodar o servidor
COPY --from=build /app/dist ./dist
# Para o Astro com Node adapter em modo standalone, node_modules de prod costuma ser necessário
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 4321

# Executamos diretamente o arquivo de entrada gerado pelo adaptador node do Astro
CMD ["bun", "./dist/server/entry.mjs"]
