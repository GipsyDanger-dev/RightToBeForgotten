# VPS_DEPLOYMENT.md

# RightToBeForgotten

Self-Hosted VPS Deployment Guide (Docker Compose)

---

# Overview

This guide describes how to deploy the two frontend applications (User Vault and Service Provider) to your own Ubuntu VPS using Docker Compose.

The smart contracts are already deployed and verified on Polygon Amoy testnet and are **not** redeployed by this guide.

| Component        | Deployment                                                                  |
| ---------------- | --------------------------------------------------------------------------- |
| Groth16Verifier  | Polygon Amoy (existing)                                                     |
| ConsentRegistry  | Polygon Amoy (existing)                                                     |
| User Vault       | VPS — Docker container (this guide)                                         |
| Service Provider | VPS — Docker container (this guide)                                         |
| Reverse proxy    | nginx-proxy (auto TLS via acme-companion) — default; Caddy variant optional |

---

# Architecture

```
                        ┌────────────────────────────┐
    vault.example.com ──►│  nginx-proxy (80/443, TLS) │
    sp.example.com   ──►│  + acme-companion (SSL)     │
                        └──────┬──────────────┬───────┘
                               │              │
                     ┌─────────▼─────┐  ┌─────▼──────────┐
                     │  user-vault   │  │service-provider│
                     │  Next.js :3000│  │ Next.js :3000  │
                     └───────────────┘  └────────────────┘
                               │              │
                        Polygon Amoy RPC (drpc.org + publicnode fallback)
```

Each app runs as an isolated container. SSL certificates are issued and renewed
automatically by `acme-companion` (Let's Encrypt).

---

# Prerequisites

## VPS

- Ubuntu 22.04 or 24.04
- Docker Engine 24+ and the Compose plugin (`docker compose version`)
- Minimum 2 GB RAM, 20 GB disk
- Ports 80 and 443 open in the firewall

## Domain

Two subdomains pointing to the VPS public IP (A records):

| Host                | Type | Value      |
| ------------------- | ---- | ---------- |
| `vault.example.com` | A    | `<VPS_IP>` |
| `sp.example.com`    | A    | `<VPS_IP>` |

DNS must resolve **before** the first `docker compose up` so certificates can be issued.

---

# Deployment Steps

## Step 1: Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

Log out and back in for the `docker` group to take effect.

## Step 2: Configure firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 3: Copy the repository to the VPS

```bash
cd /opt
git clone https://github.com/<your-org>/RightToBeForgotten.git
cd RightToBeForgotten/deploy/vps
```

(Alternatively `scp -r` the project folder from your machine.)

## Step 4: Configure environment

```bash
cp .env.example .env
nano .env
```

Required values:

| Variable                               | Example                                      | Description                             |
| -------------------------------------- | -------------------------------------------- | --------------------------------------- |
| `VAULT_DOMAIN`                         | `vault.example.com`                          | Subdomain for User Vault                |
| `SP_DOMAIN`                            | `sp.example.com`                             | Subdomain for Service Provider          |
| `LETSENCRYPT_EMAIL`                    | `admin@example.com`                          | Expiry notifications from Let's Encrypt |
| `NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS` | `0xa78Ad9B4bD61950ba670AAfFb8d1235c93c3BaBA` | Deployed registry (pre-filled)          |

Optional:

| Variable                               | Default                         | Description                    |
| -------------------------------------- | ------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_POLYGON_AMOY_RPC`         | `https://polygon-amoy.drpc.org` | Amoy RPC (build-time, inlined) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `demo`                          | WalletConnect Cloud project ID |

> **RPC note:** Polygon Labs retired the free official Amoy RPC endpoint in
> July 2026. The app uses `https://polygon-amoy.drpc.org` with automatic
> fallback to `https://polygon-amoy-bor-rpc.publicnode.com`. Both are verified
> live. The Amoy testnet (Chain ID 80002) remains fully operational.

## Step 5: Build and start

```bash
docker compose up -d --build
```

This builds both apps (npm ci + Next.js standalone build) and starts:

- `user-vault` (internal :3000)
- `service-provider` (internal :3000)
- `nginx-proxy` (80/443)
- `acme-companion` (certificates)

## Step 6: Verify

```bash
docker compose ps            # all services Up
docker compose logs -f acme-companion   # "Certificate for vault.example.com created"
```

Browser checks:

1. `https://vault.example.com` — landing page loads (HTTPS, valid cert)
2. `https://sp.example.com` — login page loads
3. `https://vault.example.com/circuits/consent.wasm` — circuit file downloads (200)

## Step 7: End-to-end validation

Follow the flows in `docs/DEMO_SCRIPT.md`:

- Flow A: Generate identity → Register consent → Generate proof → Verify access (PASS expected)
- Flow B: Revoke consent → Verify again (DENIED expected)
- Flow C: Re-consent with consentVersion=2 (PASS expected)

---

# Environment Variables Reference

The following are injected at **build time** (inlined into the JS bundle via
`NEXT_PUBLIC_*`), so changing them requires a rebuild:

| Variable                               | Source            |
| -------------------------------------- | ----------------- |
| `NEXT_PUBLIC_POLYGON_AMOY_RPC`         | `deploy/vps/.env` |
| `NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS` | `deploy/vps/.env` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `deploy/vps/.env` |

Runtime variables (proxy routing / TLS):

| Variable            | Source            |
| ------------------- | ----------------- |
| `VAULT_DOMAIN`      | `deploy/vps/.env` |
| `SP_DOMAIN`         | `deploy/vps/.env` |
| `LETSENCRYPT_EMAIL` | `deploy/vps/.env` |

---

# Update & Maintenance

```bash
git pull
docker compose up -d --build
```

- Volumes persist across rebuilds (certs, nginx config).
- `docker compose down` stops services; volumes remain.
- `docker compose down -v` removes volumes **including certificates** — certificates are re-issued automatically on next start, but expect a short TLS window.

## Logs

```bash
docker compose logs -f user-vault
docker compose logs -f service-provider
docker compose logs -f nginx-proxy
```

---

# Caddy Integration Variant

If the VPS already runs **Caddy** on ports 80/443 (e.g. an n8n stack), the two
apps can join that proxy instead of starting nginx-proxy + acme-companion.
`deploy/vps/docker-compose.caddy.yml` provides this variant:

- **No host ports published** — apps only `expose` port 3000 on the internal
  network shared with Caddy; existing sites are never disturbed.
- **External network** — the compose file joins an existing network the Caddy
  container is attached to (`RTBF_CADDY_NETWORK`, default `n8n_default`).
- **DNS still required** — Caddy's automatic HTTPS only issues certificates
  after the subdomains resolve to this server (A records from Prerequisites).
- **Unused variables** — `VAULT_DOMAIN`, `SP_DOMAIN`, and `LETSENCRYPT_EMAIL`
  are not used by this variant (no nginx-proxy/acme-companion services).
- **Site blocks are added to the existing Caddyfile**, then Caddy is validated
  and reloaded. TLS is handled by Caddy itself (automatic Let's Encrypt).

Usage:

```bash
cd deploy/vps
cp .env.example .env      # set RTBF_CADDY_NETWORK if Caddy is not on n8n_default
docker compose -f docker-compose.caddy.yml up -d --build
```

Example Caddyfile site blocks (append to the existing Caddyfile):

```caddyfile
vault.example.com {
    encode zstd gzip
    reverse_proxy user-vault:3000 { transport http { versions 1.1 } }
}
sp.example.com {
    encode zstd gzip
    reverse_proxy service-provider:3000 { transport http { versions 1.1 } }
}
```

Then validate and reload — on the host, or inside the container if Caddy is
Dockerized (common for n8n stacks):

```bash
# host-level Caddy install
caddy validate --config /etc/caddy/Caddyfile
caddy reload --config /etc/caddy/Caddyfile
```

```bash
# Dockerized Caddy (adjust the container name)
docker exec <caddy-container> caddy validate --config /etc/caddy/Caddyfile
docker exec <caddy-container> caddy reload --config /etc/caddy/Caddyfile
```

| Variable             | Description                               | Default       |
| -------------------- | ----------------------------------------- | ------------- |
| `RTBF_CADDY_NETWORK` | External Docker network shared with Caddy | `n8n_default` |

> The main `docker-compose.yml` stack (nginx-proxy + acme-companion) remains
> the default for servers with free ports 80/443.

---

# Host-Caddy Variant (systemd Caddy)

When Caddy is installed **on the host** (e.g. `/usr/bin/caddy` as a systemd
service) instead of running as a Docker container, it cannot join a Docker
network. Use `deploy/vps/docker-compose.caddy-host.yml`, which publishes both
apps on **localhost-only** host ports that the host Caddy proxies to:

| App                | Host port        |
| ------------------ | ---------------- |
| `user-vault`       | `127.0.0.1:3001` |
| `service-provider` | `127.0.0.1:3002` |

```bash
cd deploy/vps
cp .env.example .env
docker compose -f docker-compose.caddy-host.yml up -d --build
```

Append site blocks to `/etc/caddy/Caddyfile` (after backing it up), then
validate and reload:

```caddyfile
vault.example.com {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3001
}
verify.example.com {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3002
}
```

```bash
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak-$(date +%Y%m%d)
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

- DNS A records are still required (Caddy issues certs only after the
  subdomains resolve to the server).
- `VAULT_DOMAIN`, `SP_DOMAIN`, `LETSENCRYPT_EMAIL` and `RTBF_CADDY_NETWORK`
  are **not** used by this variant.

---

# Security Notes

- Environment files (`.env`) are never committed and are excluded by `.dockerignore`.
- No secrets are baked into the images (only public `NEXT_PUBLIC_*` values).
- Containers run unprivileged as the default `node` user (node:20-alpine).
- User secrets (userSecret) never leave the browser — proof generation is fully client-side.
- Circuit files are served over HTTPS and verified by SHA-256 before proof generation (FER-08).

---

# Troubleshooting

| Symptom                                                   | Fix                                                                 |
| --------------------------------------------------------- | ------------------------------------------------------------------- |
| 503 on first load                                         | App container still building/booting; wait a few minutes            |
| Certificate not issued                                    | Confirm DNS A records resolve; `docker compose logs acme-companion` |
| Build fails: `NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS` empty | Fill `.env` and rebuild — the var is required at build time         |
| Ports 80/443 in use                                       | `sudo systemctl stop apache2 nginx` if a host server occupies them  |
| `Cannot connect to the Docker daemon`                     | Re-login so the `docker` group applies, or `sudo` the command       |
| Wallet: "Chain not found"                                 | Add Polygon Amoy (Chain ID 80002, RPC from `.env`) to MetaMask      |
| Proof verification fails                                  | Confirm MetaMask is on Polygon Amoy and wallet has testnet POL      |

---

# Rollback

```bash
# Rebuild from a specific tag/commit
git checkout <previous-commit>
docker compose up -d --build
```

The immutable smart contracts do not change; only frontend builds roll back.
