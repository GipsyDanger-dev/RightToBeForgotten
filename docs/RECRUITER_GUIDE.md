# RECRUITER_GUIDE.md

# RightToBeForgotten

Technical Interview Guide

---

# Project Overview

RightToBeForgotten is a decentralized privacy-preserving consent management system that implements the Right to be Forgotten using Zero-Knowledge Proofs and Cryptographic Erasure. It is a full-stack proof-of-concept deployed on Polygon Amoy testnet.

**Duration:** ~3 months (self-directed)
**Role:** Solo developer (architecture, smart contracts, ZKP circuits, frontend, security, documentation)

---

# Key Technical Achievements

## 1. Zero-Knowledge Proof System

- Designed and implemented a Circom circuit for privacy-preserving consent verification
- Implemented Groth16 proof generation in the browser using Web Workers
- Integrated on-chain proof verification via Solidity verifier contract
- Used Poseidon hash (ZKP-friendly) instead of SHA-256 for circuit efficiency

**Talking point:** "I built a ZKP circuit that proves a user authorized a service provider without revealing who the user is. The proof is generated entirely in the browser and verified on-chain."

## 2. Smart Contract Engineering

- Designed ConsentRegistry with Checks-Effects-Interactions (CEI) pattern
- Implemented nullifier-based replay attack prevention
- Used custom errors instead of string reverts for gas optimization
- 43/43 tests passing, including integration tests with actual ZK proofs

**Talking point:** "The smart contract verifies ZK proofs on-chain while tracking nullifiers to prevent replay attacks. I used the CEI pattern and custom errors for security and gas efficiency."

## 3. Cryptographic Engineering

- Implemented Poseidon hash derivation for consentId and nullifier
- Designed per-consent nullifier scoping to prevent cross-service linking
- Implemented PBKDF2 + AES-GCM encryption for identity at rest
- Built circuit file integrity verification (SHA-256, FER-08)

**Talking point:** "Each nullifier is scoped to a specific consent and service provider, so verifying with one service provider doesn't reveal your relationship with another."

## 4. Privacy Architecture

- Zero PII stored on-chain (only hashes)
- Identity separated from wallet address
- Local proof generation (browser-side, never transmitted)
- Cryptographic erasure instead of data deletion

**Talking point:** "The system never stores personal information on-chain. When a user revokes consent, we don't delete data — we destroy the cryptographic ability to verify it."

## 5. Full-Stack Implementation

- Next.js 14 with App Router (two applications)
- TypeScript throughout (contracts, circuits, frontend)
- Wagmi v2 + ConnectKit for wallet integration
- IndexedDB with encryption for local identity storage
- Monorepo with npm workspaces

---

# Technologies Demonstrated

## Blockchain & Smart Contracts

| Technology      | Usage                            |
| --------------- | -------------------------------- |
| Solidity 0.8.24 | ConsentRegistry, Groth16Verifier |
| Hardhat         | Development, testing, deployment |
| Polygon Amoy    | Testnet deployment               |
| viem            | Low-level Ethereum interactions  |
| Wagmi v2        | React hooks for Ethereum         |
| ConnectKit      | Wallet connection UI             |

## Zero-Knowledge Proofs

| Technology | Usage                             |
| ---------- | --------------------------------- |
| Circom v2  | Circuit language                  |
| SnarkJS    | Proof generation and verification |
| Groth16    | Proof system (BN254 curve)        |
| Poseidon   | ZKP-friendly hash function        |
| circomlib  | Standard circuit library          |

## Frontend

| Technology     | Usage                         |
| -------------- | ----------------------------- |
| Next.js 14     | React framework (App Router)  |
| TypeScript     | Type safety                   |
| TailwindCSS    | Styling                       |
| Web Workers    | Non-blocking proof generation |
| IndexedDB      | Client-side encrypted storage |
| Web Crypto API | PBKDF2 + AES-GCM encryption   |

## Security

| Concept            | Application                              |
| ------------------ | ---------------------------------------- |
| CEI pattern        | Reentrancy protection in smart contracts |
| Nullifier tracking | Replay attack prevention                 |
| PBKDF2             | Key derivation from passphrase           |
| AES-GCM            | Authenticated encryption at rest         |
| SHA-256 integrity  | Circuit file tamper detection            |

---

# Security Engineering Aspects

## Threat Model

The project considers 5 threat actors:

1. **Malicious service provider** — tries to access without valid consent
2. **Replay attacker** — tries to reuse a valid proof
3. **Identity thief** — tries to impersonate a user
4. **Front-runner** — tries to extract proof from mempool
5. **Curious observer** — tries to link user across services

## Mitigations

- Consent state checked before proof verification (blocks #1)
- Nullifier tracking prevents proof reuse (blocks #2)
- userSecret never leaves the device (blocks #3)
- Nullifier can only be used after valid proof verification (blocks #4)
- Per-consent nullifier scoping prevents cross-service linking (blocks #5)

---

# Blockchain Engineering Aspects

## Design Decisions

1. **Groth16 over PLONK** — Smaller proof size, faster on-chain verification. Trade-off: requires trusted setup.
2. **Polygon Amoy over Sepolia** — Lower gas costs for demo. EVM-compatible.
3. **Poseidon over SHA-256** — ZKP-friendly hash. ~10x fewer constraints in circuit.
4. **Per-consent nullifiers** — Prevents cross-service linking. Trade-off: slightly more complex circuit.

## Gas Optimization

- Custom errors instead of string reverts (~200 gas saved per revert)
- CEI pattern minimizes storage writes after external calls
- Early-exit pattern for revoked consents (~330k gas saved)
- View functions are free off-chain

---

# Cryptography Aspects

## Zero-Knowledge Proofs

The system uses Groth16 to prove:

- "I know a secret (userSecret) such that poseidon(userSecret, spId, consentVersion) = consentId"
- Without revealing userSecret or consentVersion

This allows a service provider to verify that a user authorized access without learning who the user is.

## Cryptographic Erasure

Traditional erasure deletes data. Cryptographic erasure destroys the ability to use data.

In this system:

1. User revokes consent on-chain
2. Consent state changes to REVOKED (permanent)
3. Any future proof verification fails
4. Service provider loses verification capability
5. The "data" (consentId hash) still exists on-chain, but is functionally useless

## ConsentID Derivation

```
consentId = poseidon(userSecret, spId, consentVersion)
```

- `userSecret` — random 256-bit integer (private)
- `spId` — service provider wallet address (public)
- `consentVersion` — monotonically increasing integer (private)

Properties: deterministic, unique, privacy-preserving, re-consent capable

## Nullifier Derivation

```
nullifier = poseidon(userSecret, consentId, spId)
```

Properties: deterministic, per-consent scoped, prevents replay, prevents cross-service linking

---

# Suggested Interview Talking Points

## "Walk me through the architecture."

"The system has four layers: User Vault (Next.js), ZKP Layer (Circom + SnarkJS), Consent Registry (Solidity on Polygon), and Service Provider (Next.js). The user generates an identity locally, registers consent on-chain, generates a ZK proof in the browser, and the service provider submits that proof to the smart contract for verification. Revocation permanently destroys the ability to verify."

## "How does the ZKP work?"

"I designed a Circom circuit with three private inputs — userSecret, spId, and consentVersion — and two public inputs — consentId and nullifier. The circuit proves that the user knows the secret that hashes to the consentId, without revealing the secret. The proof is generated using Groth16 in the browser via snarkjs, and verified on-chain using a Solidity verifier contract."

## "How do you handle revocation?"

"Revocation is permanent. When a user calls revokeConsent(), the consent state changes to REVOKED on-chain. The verifyAccess() function checks consent state BEFORE verifying the proof, so revoked consents are rejected immediately. This is cryptographic erasure — we don't delete data, we destroy the ability to use it."

## "What security considerations did you have?"

"I implemented several layers: nullifier tracking prevents replay attacks, per-consent nullifier scoping prevents cross-service linking, the CEI pattern prevents reentrancy, circuit file integrity verification prevents tampering, and identity encryption at rest protects the user's secret. The key design principle is that no PII ever touches the blockchain."

## "What was the hardest part?"

"Designing the nullifier system. The challenge was preventing proof replay without creating a unique identifier that could link users across services. I solved this by scoping nullifiers to (userSecret, consentId, spId) — each consent has its own nullifier, so verifying with one service provider doesn't reveal your relationship with another."

## "What would you do differently in production?"

"Three things: use a multi-party computation ceremony for the trusted setup instead of generating it locally, increase PBKDF2 iterations from 100,000 to 600,000, and add a proof freshness mechanism with timestamps or nonces. I'd also implement a commit-reveal scheme to prevent mempool front-running."

---

# Project Metrics

| Metric                        | Value                                  |
| ----------------------------- | -------------------------------------- |
| Smart contract tests          | 43/43 passing                          |
| Gas cost (registerConsent)    | 74,649                                 |
| Gas cost (verifyAccess)       | 363,197                                |
| Circuit constraints           | 528 non-linear                         |
| Proof size                    | ~256 bytes                             |
| Frontend apps                 | 2 (User Vault + Service Provider)      |
| Documentation pages           | 15+                                    |
| Architecture Decision Records | 3                                      |
| Deployment                    | Polygon Amoy (verified on Polygonscan) |

---

# Repository

**GitHub:** https://github.com/GipsyDanger-dev/RightToBeForgotten

**Key files:**

- `contracts/src/ConsentRegistry.sol` — Main smart contract
- `circuits/src/consent.circom` — ZKP circuit
- `apps/user-vault/lib/proof.ts` — Proof generation logic
- `apps/user-vault/lib/identity.ts` — Identity management
- `docs/Security.md` — Threat model
- `docs/Architecture.md` — System architecture
