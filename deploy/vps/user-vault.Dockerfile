# syntax=docker/dockerfile:1
#
# RightToBeForgotten — User Vault
# Build from the repository ROOT:
#   docker build -f deploy/vps/user-vault.Dockerfile -t rtbf/user-vault:latest .
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

ARG NEXT_PUBLIC_POLYGON_AMOY_RPC
ARG NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS
ARG NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ENV NEXT_PUBLIC_POLYGON_AMOY_RPC=$NEXT_PUBLIC_POLYGON_AMOY_RPC \
    NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS=$NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS \
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

RUN npm run build --workspace @right-to-be-forgotten/user-vault

# ---- Stage 3: minimal runtime from the standalone output ----
FROM node:20-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /repo/apps/user-vault/.next/standalone ./
COPY --from=builder /repo/apps/user-vault/.next/static ./apps/user-vault/.next/static
# Public assets (includes circuits/consent.wasm + consent_final.zkey)
COPY --from=builder /repo/apps/user-vault/public ./apps/user-vault/public
EXPOSE 3000
CMD ["node", "apps/user-vault/server.js"]
