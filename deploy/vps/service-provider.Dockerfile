# syntax=docker/dockerfile:1
#
# RightToBeForgotten — Service Provider
# Build from the repository ROOT:
#   docker build -f deploy/vps/service-provider.Dockerfile -t rtbf/service-provider:latest .
# Or via docker-compose (deploy/vps/docker-compose.yml).

# ---- Stage 1: install all workspace dependencies ----
FROM node:20-alpine AS deps
WORKDIR /repo
COPY . .
# --ignore-scripts: husky/git hooks are not needed inside the image.
RUN npm ci --ignore-scripts

# ---- Stage 2: build the app (NEXT_PUBLIC_* vars inlined at build time) ----
FROM node:20-alpine AS builder
WORKDIR /repo
COPY . .
COPY --from=deps /repo/node_modules ./node_modules
# Some packages (connectkit, @types/node) install nested under apps/*/node_modules
# (not hoisted) — copy the whole apps tree from deps so the build can resolve them.
COPY --from=deps /repo/apps ./apps

ARG NEXT_PUBLIC_POLYGON_AMOY_RPC
ARG NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS
ARG NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ENV NEXT_PUBLIC_POLYGON_AMOY_RPC=$NEXT_PUBLIC_POLYGON_AMOY_RPC \
    NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS=$NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS \
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

RUN npm run build --workspace @right-to-be-forgotten/service-provider

# ---- Stage 3: minimal runtime from the standalone output ----
FROM node:20-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /repo/apps/service-provider/.next/standalone ./
COPY --from=builder --chown=node:node /repo/apps/service-provider/.next/static ./apps/service-provider/.next/static
# Run unprivileged (see docs/VPS_DEPLOYMENT.md security notes)
USER node
EXPOSE 3000
CMD ["node", "apps/service-provider/server.js"]
