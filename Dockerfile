# syntax = docker/dockerfile:1

# Node 24 strips TypeScript's erasable syntax natively, so there's no build
# step: the image just needs prod dependencies and the source, and runs the
# .ts files directly. node:sqlite (also built in, no native addon) is the only
# storage --- one file on the volume Fly mounts at /data.

FROM node:24.21.0-bookworm-slim AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate \
    && pnpm install --prod --frozen-lockfile

FROM node:24.21.0-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY README.md ./
EXPOSE 8080
CMD ["node", "src/server.ts"]
