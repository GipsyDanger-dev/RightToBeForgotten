# VPS Deployment (Docker Compose)

Deploy both frontends (User Vault + Service Provider) to an Ubuntu VPS with
Docker Compose, Nginx reverse proxy, and automatic Let's Encrypt SSL.

Smart contracts are **already deployed** on Polygon Amoy and do not need to be
redeployed. This stack only hosts the two Next.js apps.

---

## 1. Requirements (VPS)

- Ubuntu 22.04 or 24.04
- Docker Engine 24+ with the compose plugin
- A domain with two subdomains (e.g. `vault.example.com`, `sp.example.com`)

## 2. One-time server preparation

```bash
# Install Docker (official convenience script)
curl -fsSL https://get.docker.com | sh

# Enable Docker to start on boot and add your user to the docker group
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
# Log out and back in so the docker group takes effect

# Open firewall ports (if ufw is active)
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 3. DNS

Create **A records** pointing both subdomains at the VPS IP:

| Host                | Type | Value      |
| ------------------- | ---- | ---------- |
| `vault.example.com` | A    | `<VPS_IP>` |
| `sp.example.com`    | A    | `<VPS_IP>` |

Certificates are issued automatically, but only **after** DNS resolves.

## 4. Get the code onto the VPS

```bash
cd /opt
git clone https://github.com/<your-org>/RightToBeForgotten.git
cd RightToBeForgotten/deploy/vps
```

## 5. Configure environment

```bash
cp .env.example .env
nano .env
```

Set `VAULT_DOMAIN`, `SP_DOMAIN`, `LETSENCRYPT_EMAIL`. The blockchain values are
pre-filled with the live Polygon Amoy deployment — only change them if you
redeployed the contracts.

## 6. Build and start

```bash
docker compose up -d --build
```

Watch the logs until certificates are issued:

```bash
docker compose logs -f acme-companion
```

First launch takes a few minutes (npm ci + Next.js build for both apps).
Subsequent rebuilds are cached.

## 7. Verify

| URL                                      | Expect                                     |
| ---------------------------------------- | ------------------------------------------ |
| `https://vault.example.com`              | User Vault landing page                    |
| `https://sp.example.com`                 | Service Provider "Login With Privacy" page |
| `https://<domain>/circuits/consent.wasm` | 200 (circuit file served)                  |

Run the full demo: generate identity → register consent → generate proof →
verify access (see `docs/DEMO_SCRIPT.md`).

## 8. Everyday operations

```bash
# Logs
docker compose logs -f user-vault
docker compose logs -f service-provider

# Update after a new git pull
git pull
docker compose up -d --build

# Restart / stop
docker compose restart
docker compose down          # stops everything
docker compose down -v       # ALSO wipes SSL certs & volumes — avoid unless intentional
```

## 9. Troubleshooting

| Symptom                                            | Fix                                                                      |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| `503 Service Temporarily Unavailable`              | App container still starting; wait for build/first boot                  |
| Certificate not issued                             | DNS must resolve before `up`; check `docker compose logs acme-companion` |
| `NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS` unset error | Edit `.env`, then `docker compose up -d --build` (build-time var)        |
| Port 80/443 in use                                 | Stop conflicting services (`sudo systemctl stop apache2 nginx`)          |
| Wallet says "chain not found"                      | Add Polygon Amoy (Chain ID 80002) to MetaMask; RPC fallbacks built-in    |

> **Note on RPC endpoints:** Polygon Labs retired the free official Amoy RPC
> (`rpc-amoy.polygon.technology`) in July 2026. The stack uses
> `https://polygon-amoy.drpc.org` with a publicnode fallback — both verified
> live. The Amoy testnet (Chain ID 80002) itself remains operational.
