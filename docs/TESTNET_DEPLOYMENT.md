# TESTNET_DEPLOYMENT.md

# RightToBeForgotten

Step-by-Step Testnet Deployment Guide

---

# Purpose

This document provides a step-by-step manual deployment guide for the RightToBeForgotten system to Polygon Amoy testnet. Follow each step in order.

---

# Prerequisites Checklist

Before starting, verify you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] MetaMask or compatible wallet installed
- [ ] Wallet with Polygon Amoy testnet MATIC (minimum 0.5 MATIC)
- [ ] Polygonscan API key (for contract verification)
- [ ] Vercel account (for frontend deployment)

---

# Step 1: Get Testnet MATIC

1. Open browser and navigate to https://faucet.polygon.technology/
2. Select "Amoy" from the network dropdown
3. Enter your deployer wallet address
4. Click "Submit" to receive testnet MATIC
5. Verify balance in MetaMask (switch to Polygon Amoy network)

**Minimum required:** 0.5 MATIC for deployment + verification transactions

---

# Step 2: Configure Environment

```bash
# Navigate to project root
cd RightToBeForgotten

# Copy environment template
cp .env.example .env
```

Edit `.env` with your values:

```
POLYGON_AMOY_RPC_URL=https://polygon-amoy.drpc.org
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_polygonscan_api_key_here

> **Note (2026-07):** The official `rpc-amoy.polygon.technology` endpoint was retired
> by Polygon Labs. The Amoy testnet itself remains active. Use
> `https://polygon-amoy.drpc.org` (primary) or
> `https://polygon-amoy-bor-rpc.publicnode.com` (fallback).
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

**WARNING:** Never commit `.env` to version control. Never share private keys.

---

# Step 3: Install Dependencies

```bash
# Install root dependencies
npm install

# Install contract dependencies
cd contracts
npm install
cd ..
```

---

# Step 4: Compile Smart Contracts

```bash
cd contracts
npx hardhat compile
```

Expected output:

```
Compiled 2 Solidity files successfully
```

Artifacts generated in `contracts/artifacts/`.

---

# Step 5: Deploy Smart Contracts

```bash
cd contracts
npx hardhat run deploy/deploy-consent-registry.ts --network polygonAmoy
```

Expected output:

```
Groth16Verifier deployed to: 0x...
ConsentRegistry deployed to: 0x...
```

**Record both addresses.** You will need them for frontend configuration.

---

# Step 6: Record Deployment

Create `docs/DEPLOYMENT_RECORD.md`:

```markdown
# Deployment Record

## Network: Polygon Amoy

### Groth16Verifier

- Address: [PASTE VERIFIER ADDRESS]
- Deployer: [YOUR WALLET ADDRESS]

### ConsentRegistry

- Address: [PASTE REGISTRY ADDRESS]
- Constructor Args: [Groth16Verifier address]
- Deployer: [YOUR WALLET ADDRESS]

## Compiler

- Solidity: 0.8.24
- Optimizer: enabled (200 runs)

## Date: YYYY-MM-DD
```

---

# Step 7: Verify Contracts on Polygonscan

## Verify Groth16Verifier

```bash
cd contracts
npx hardhat verify --network polygonAmoy [VERIFIER_ADDRESS]
```

## Verify ConsentRegistry

```bash
cd contracts
npx hardhat verify --network polygonAmoy [REGISTRY_ADDRESS] [VERIFIER_ADDRESS]
```

## Manual Verification (if CLI fails)

1. Visit https://amoy.polygonscan.com/
2. Search for contract address
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Select: Compiler Type = Solidity (Single file)
6. Select: Compiler Version = v0.8.24+commit.e11b9ed9
7. Select: Optimization = Yes (200 runs)
8. Paste contract source code
9. Click "Verify and Publish"

---

# Step 8: Configure Frontend Environment Variables

## User Vault

```bash
cd apps/user-vault
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_POLYGON_AMOY_RPC=https://polygon-amoy.drpc.org
NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS=[CONSENT_REGISTRY_ADDRESS from Step 5]
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=[YOUR_PROJECT_ID]
```

## Service Provider

```bash
cd apps/service-provider
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_POLYGON_AMOY_RPC=https://polygon-amoy.drpc.org
NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS=[SAME ADDRESS AS USER VAULT]
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=[YOUR_PROJECT_ID]
```

---

# Step 9: Verify Circuit Files

Ensure circuit files are present in `apps/user-vault/public/circuits/`:

```bash
ls -la apps/user-vault/public/circuits/
```

Expected files:

- `consent.wasm` (1,839,814 bytes)
- `consent_final.zkey` (567,428 bytes)

Verify SHA-256 hashes match these known-good values:

| File               | SHA-256                                                            |
| ------------------ | ------------------------------------------------------------------ |
| consent.wasm       | `88c57c466c4214d501bb4d452250a1bfef58a9d74d7fd596345e04a8fc7855b7` |
| consent_final.zkey | `24acca388172cf60e2451debf570e90107a6e5b0bf33c41abbd706b20b680f1e` |

```bash
# Windows (PowerShell)
Get-FileHash apps/user-vault/public/circuits/consent.wasm -Algorithm SHA256
Get-FileHash apps/user-vault/public/circuits/consent_final.zkey -Algorithm SHA256

# Linux/macOS
sha256sum apps/user-vault/public/circuits/consent.wasm
sha256sum apps/user-vault/public/circuits/consent_final.zkey
```

---

# Step 10: Build Frontend Applications

## Build User Vault

```bash
cd apps/user-vault
npm run build
```

Expected: Build succeeds with no errors.

## Build Service Provider

```bash
cd apps/service-provider
npm run build
```

Expected: Build succeeds with no errors.

---

# Step 11: Deploy User Vault to Vercel

## Option A: Vercel CLI

```bash
npm i -g vercel
cd apps/user-vault
vercel
```

Follow prompts:

- Set up and deploy? Yes
- Which scope? (select your account)
- Link to existing project? No
- Project name? right-to-be-forgotten-vault
- Directory? ./
- Override settings? No

## Option B: Vercel Dashboard

1. Visit https://vercel.com/
2. Click "New Project"
3. Import GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `apps/user-vault`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_POLYGON_AMOY_RPC` = `https://polygon-amoy.drpc.org`
   - `NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS` = `[CONSENT_REGISTRY_ADDRESS]`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` = `[YOUR_PROJECT_ID]`
6. Click "Deploy"

---

# Step 12: Deploy Service Provider to Vercel

Same process as Step 11, with:

- Project name: `right-to-be-forgotten-sp`
- Root Directory: `apps/service-provider`
- Same environment variables

---

# Step 13: Configure MetaMask for Polygon Amoy

If Polygon Amoy is not in your MetaMask:

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter:
   - Network Name: Polygon Amoy
   - RPC URL: https://polygon-amoy.drpc.org
   - Chain ID: 80002
   - Currency Symbol: MATIC
   - Block Explorer: https://amoy.polygonscan.com
5. Click "Save"

---

# Step 14: Verify Deployment

## Verify Contracts

1. Visit https://amoy.polygonscan.com/
2. Search for ConsentRegistry address
3. Verify:
   - [ ] Contract is verified (green checkmark)
   - [ ] Read functions work (getConsentState, isConsentActive)
   - [ ] Events tab shows deployment event

## Verify User Vault

1. Visit deployed User Vault URL
2. Connect wallet (MetaMask on Amoy network)
3. Generate identity
4. Register consent for a service provider address

## Verify Service Provider

1. Visit deployed Service Provider URL
2. Connect wallet
3. Submit proof from User Vault
4. Click "Verify Access"

---

# Step 15: End-to-End Flow Verification

## Flow A: Register -> Verify -> Access Granted

1. User Vault: Generate identity (or unlock existing)
2. User Vault: Register consent for SP wallet address
3. User Vault: Generate proof
4. User Vault: Copy proof JSON
5. Service Provider: Paste proof JSON on Login page
6. Service Provider: Click "Verify Access"
7. **Expected:** "Access Verified" message
8. Service Provider: Click "Access Protected Content"
9. **Expected:** Protected page loads

## Flow B: Register -> Revoke -> Verify -> Access Denied

1. Complete Flow A
2. User Vault: Go to Dashboard
3. User Vault: Click "Revoke" on the consent
4. User Vault: Confirm revocation
5. Service Provider: Submit same proof
6. Service Provider: Click "Verify Access"
7. **Expected:** "Access Denied" message

## Flow C: Re-consent after Revocation

1. Complete Flow B
2. User Vault: Register new consent for same SP (v2)
3. User Vault: Generate new proof
4. Service Provider: Submit new proof
5. Service Provider: Click "Verify Access"
6. **Expected:** "Access Verified" message

---

# Deployment Complete

After all 15 steps pass:

1. Record all URLs and addresses
2. Create `docs/DEPLOYMENT_RECORD.md`
3. Update `docs/Task.md` with Phase 6 completion

---

# Troubleshooting

## Contract Deployment

| Error                 | Solution                                                           |
| --------------------- | ------------------------------------------------------------------ |
| insufficient funds    | Get more testnet MATIC from faucet                                 |
| nonce too high        | Reset MetaMask account (Settings > Advanced > Clear activity data) |
| cannot estimate gas   | Check RPC URL, try different RPC endpoint                          |
| contract not deployed | Verify PRIVATE_KEY has MATIC balance                               |

## Frontend Build

| Error                                                    | Solution                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| Module not found: @react-native-async-storage            | Warning only, app still builds correctly                     |
| Critical dependency: request of dependency is expression | Warning from snarkjs, app still works                        |
| Circuit files not loading                                | Verify files in public/circuits/, check browser console 404s |

## Wallet Connection

| Error                | Solution                                      |
| -------------------- | --------------------------------------------- |
| Chain not found      | Add Polygon Amoy to MetaMask (see Step 13)    |
| Transaction reverted | Check MATIC balance, verify contract address  |
| User rejected        | User needs to approve transaction in MetaMask |

## Contract Verification

| Error                       | Solution                                       |
| --------------------------- | ---------------------------------------------- |
| Already verified            | Contract is already verified, no action needed |
| Wrong compiler version      | Use v0.8.24+commit.e11b9ed9                    |
| Wrong optimization settings | Enable optimizer, 200 runs                     |
