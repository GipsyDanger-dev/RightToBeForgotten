# DEPLOYMENT.md

# RightToBeForgotten

Deployment Guide

---

# Overview

This document describes how to deploy the RightToBeForgotten system to Polygon Amoy testnet and Vercel.

The deployment consists of three components:

1. Smart Contracts (Polygon Amoy)
2. User Vault Frontend (Vercel)
3. Service Provider Frontend (Vercel)

---

# Prerequisites

## Required Tools

- Node.js 18+
- npm 9+
- Git
- MetaMask or compatible wallet

## Required Accounts

- Polygon Amoy testnet MATIC (from faucet)
- Polygonscan API key (for contract verification)
- Vercel account (for frontend deployment)
- WalletConnect Cloud project ID (optional, for WalletConnect support)

## Required Environment Variables

Create a `.env` file in the project root:

```bash
# Blockchain
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_polygonscan_api_key

# Frontend
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

**WARNING:** Never commit `.env` files. Never share private keys.

---

# Deployment Order

1. Deploy Smart Contracts
2. Record Contract Addresses
3. Configure Frontend Environment Variables
4. Deploy User Vault
5. Deploy Service Provider
6. Verify End-to-End Flows

---

# Smart Contract Deployment

## Step 1: Get Testnet MATIC

1. Visit [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Amoy" network
3. Enter your wallet address
4. Request testnet MATIC

## Step 2: Configure Environment

```bash
cd contracts
cp ../.env.example ../.env
# Edit .env with your values
```

## Step 3: Compile Contracts

```bash
npm run compile
```

## Step 4: Deploy Contracts

```bash
npx hardhat run deploy/deploy-consent-registry.ts --network polygonAmoy
```

Expected output:

```
Groth16Verifier deployed to: 0x...
ConsentRegistry deployed to: 0x...
```

## Step 5: Record Deployment

Create `docs/DEPLOYMENT_RECORD.md` with:

```markdown
# Deployment Record

## Network: Polygon Amoy

### Groth16Verifier

- Address: 0x...
- Transaction: 0x...
- Block: ...
- Deployer: 0x...

### ConsentRegistry

- Address: 0x...
- Transaction: 0x...
- Block: ...
- Deployer: 0x...
- Constructor Args: [Groth16Verifier address]

## Compiler

- Solidity: 0.8.24
- Optimizer: enabled (200 runs)

## Date: YYYY-MM-DD
```

---

# Contract Verification

## Verify Groth16Verifier

```bash
npx hardhat verify --network polygonAmoy <VERIFIER_ADDRESS>
```

## Verify ConsentRegistry

```bash
npx hardhat verify --network polygonAmoy <REGISTRY_ADDRESS> <VERIFIER_ADDRESS>
```

## Verify on Polygonscan

1. Visit [amoy.polygonscan.com](https://amoy.polygonscan.com/)
2. Search for contract address
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Select compiler settings matching hardhat.config.ts

---

# Frontend Deployment (Vercel)

## User Vault

### Step 1: Prepare Environment

```bash
cd apps/user-vault
cp .env.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS=0x...  # From deployment
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

### Step 2: Copy Circuit Files

Ensure circuit files are in `apps/user-vault/public/circuits/`:

- consent.wasm (1,839,814 bytes / ~1.75 MB)
- consent_final.zkey (567,428 bytes / ~554 KB)

### Step 3: Deploy to Vercel

Option A: Vercel CLI

```bash
npm i -g vercel
cd apps/user-vault
vercel
```

Option B: Vercel Dashboard

1. Connect GitHub repository
2. Set root directory to `apps/user-vault`
3. Configure environment variables
4. Deploy

### Step 4: Configure Environment in Vercel

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

## Service Provider

### Step 1: Prepare Environment

```bash
cd apps/service-provider
cp .env.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS=0x...  # Same as User Vault
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

### Step 2: Deploy to Vercel

Same process as User Vault, with root directory set to `apps/service-provider`.

---

# Post-Deployment Verification

## Contract Verification

1. Visit [amoy.polygonscan.com](https://amoy.polygonscan.com/)
2. Search for ConsentRegistry address
3. Verify:
   - Contract is verified (green checkmark)
   - Read functions work (getConsentState, isConsentActive)
   - Events tab shows deployment event

## Frontend Verification

1. Visit deployed User Vault URL
2. Connect wallet (MetaMask on Amoy network)
3. Generate identity
4. Register consent
5. Visit Service Provider URL
6. Submit proof
7. Verify access

## End-to-End Flow Verification

### Flow A: Register → Verify → Access Granted

1. User Vault: Generate identity
2. User Vault: Register consent for SP address
3. User Vault: Generate proof
4. Service Provider: Submit proof
5. Service Provider: Click "Verify Access"
6. Expected: "Access Verified"

### Flow B: Register → Revoke → Verify → Access Denied

1. Complete Flow A
2. User Vault: Revoke consent
3. Service Provider: Submit same proof
4. Service Provider: Click "Verify Access"
5. Expected: "Access Denied"

### Flow C: Re-consent after Revocation

1. Complete Flow B
2. User Vault: Register new consent (v2)
3. User Vault: Generate new proof
4. Service Provider: Submit new proof
5. Service Provider: Click "Verify Access"
6. Expected: "Access Verified"

---

# Environment Variables Reference

## Root .env (for contract deployment)

| Variable             | Required | Description                          |
| -------------------- | -------- | ------------------------------------ |
| POLYGON_AMOY_RPC_URL | YES      | Polygon Amoy RPC endpoint            |
| PRIVATE_KEY          | YES      | Deployer wallet private key          |
| ETHERSCAN_API_KEY    | YES      | Polygonscan API key for verification |

## apps/user-vault/.env.local

| Variable                             | Required | Description                      |
| ------------------------------------ | -------- | -------------------------------- |
| NEXT_PUBLIC_POLYGON_AMOY_RPC         | YES      | Polygon Amoy RPC endpoint        |
| NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS | YES      | Deployed ConsentRegistry address |
| NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID | NO       | WalletConnect Cloud project ID   |

## apps/service-provider/.env.local

| Variable                             | Required | Description                      |
| ------------------------------------ | -------- | -------------------------------- |
| NEXT_PUBLIC_POLYGON_AMOY_RPC         | YES      | Polygon Amoy RPC endpoint        |
| NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS | YES      | Deployed ConsentRegistry address |
| NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID | NO       | WalletConnect Cloud project ID   |

---

# Troubleshooting

## Contract Deployment

### "insufficient funds for intrinsic transaction cost"

- Solution: Get more testnet MATIC from faucet

### "nonce too high"

- Solution: Reset MetaMask account (Settings → Advanced → Clear activity data)

### "cannot estimate gas"

- Solution: Check RPC URL is correct, try different RPC endpoint

## Frontend Deployment

### "Module not found: Can't resolve '@react-native-async-storage/async-storage'"

- This is a warning from MetaMask SDK, not an error
- The app will still build and function correctly

### "Critical dependency: the request of a dependency is an expression"

- This is a warning from snarkjs/ffjavascript
- The app will still build and function correctly

### Circuit files not loading

- Ensure consent.wasm and consent_final.zkey are in `public/circuits/`
- Check browser console for 404 errors
- Verify file paths in snarkjs-worker.ts

## Wallet Connection

### "Chain not found"

- Add Polygon Amoy to MetaMask:
  - Network Name: Polygon Amoy
  - RPC URL: https://rpc-amoy.polygon.technology
  - Chain ID: 80002
  - Currency Symbol: MATIC
  - Block Explorer: https://amoy.polygonscan.com

### "Transaction reverted"

- Check wallet has enough MATIC for gas
- Verify contract address is correct
- Check consent is not already registered/revoked

---

# Rollback Procedure

## Smart Contracts

Smart contracts are immutable once deployed. To "rollback":

1. Deploy new contracts
2. Update frontend environment variables
3. Redeploy frontends

## Frontend

1. Go to Vercel Dashboard
2. Select project
3. Go to Deployments
4. Find previous working deployment
5. Click "..." → "Promote to Production"

---

# Security Checklist

Before going live:

- [ ] Private keys are NOT in repository
- [ ] .env files are in .gitignore
- [ ] Contract addresses are verified on Polygonscan
- [ ] Environment variables are set in Vercel
- [ ] Circuit files are served over HTTPS
- [ ] Wallet connection works on correct network
- [ ] All 3 flows (A, B, C) pass on testnet

---

# Support

For issues:

1. Check Troubleshooting section
2. Review browser console for errors
3. Check Polygonscan for transaction status
4. Review Vercel deployment logs
