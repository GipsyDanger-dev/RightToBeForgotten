# Architecture.md

# RightToBeForgotten

System Architecture Specification

---

# Architecture Overview

RightToBeForgotten implements the Right to be Forgotten using:

- Zero-Knowledge Proofs
- Cryptographic Erasure
- Smart Contracts
- Decentralized Consent Management

The architecture separates:

1. Identity Verification
2. Consent Management
3. Data Storage
4. Access Validation

This separation minimizes trust assumptions and improves privacy.

---

# High Level Architecture

┌──────────────────────┐
│ User Vault │
│ Next.js │
└──────────┬───────────┘
│
│ Generate Proof
│
▼
┌──────────────────────┐
│ ZKP Layer │
│ Circom + SnarkJS │
└──────────┬───────────┘
│
│ Submit Proof
│
▼
┌──────────────────────┐
│ Consent Registry │
│ Solidity Contract │
└──────────┬───────────┘
│
│ Verify Access
│
▼
┌──────────────────────┐
│ Service Provider │
│ Demo Application │
└──────────────────────┘

---

# System Components

## Component 1

User Vault

Purpose:

Acts as the user's control center.

Responsibilities:

- Generate identity
- Manage consent
- Generate proofs
- Revoke consent
- Connect wallet

Technology:

- Next.js
- React
- TypeScript
- Ethers.js
- Wagmi

---

## Component 2

ZKP Layer

Purpose:

Generate privacy-preserving proofs.

Responsibilities:

- Identity verification
- Proof generation
- Witness generation
- Proof export

Technology:

- Circom
- SnarkJS
- Groth16

Outputs:

- proof.json
- publicSignals.json
- verifier.sol

---

## Component 3

Consent Registry

Purpose:

Store consent status.

Responsibilities:

- Register consent
- Revoke consent
- Validate consent
- Verify proof

Technology:

- Solidity
- Hardhat

Deployment:

Polygon Amoy Testnet

---

## Component 4

Service Provider

Purpose:

Simulate third-party application access.

Responsibilities:

- Request proof
- Submit proof
- Verify authorization
- Grant access

Technology:

- Next.js
- TypeScript

Example:

HealthApp

---

# Identity Architecture

Every user owns:

- userSecret
- consentVersion

Generated locally.

Stored locally (encrypted in IndexedDB using PBKDF2 + AES-GCM).

Never transmitted directly.

Never stored on-chain.

Service Provider Identifier (spId):

The service provider's Ethereum wallet address. This serves as a unique, deterministic identifier for each service provider in consent and nullifier derivation.

The nullifier is derived per-consent: poseidon(userSecret, consentId, spId).

---

# Consent Architecture

Consent is represented by:

ConsentID

Derived from:

poseidon(userSecret, serviceProviderId, consentVersion)

Where consentVersion is a monotonically increasing integer that enables re-consent after revocation while preserving revocation finality for each generation.

Properties:

- Unique
- Deterministic
- Verifiable
- Privacy-preserving
- Re-consent capable (via consentVersion)

---

# Consent Lifecycle

State 1

NOT_REGISTERED

↓

State 2

ACTIVE

↓

State 3

REVOKED

Terminal State

No further transitions allowed.

---

# State Transition Rules

NOT_REGISTERED → ACTIVE

Allowed

---

ACTIVE → REVOKED

Allowed

---

REVOKED → ACTIVE

Forbidden

---

REVOKED → NOT_REGISTERED

Forbidden

---

# User Registration Flow

Step 1

User opens User Vault.

---

Step 2

Identity generated locally.

---

Step 3

ConsentID generated.

---

Step 4

registerConsent() called.

---

Step 5

Consent becomes ACTIVE.

---

# Verification Flow

Step 1

Service Provider requests verification.

---

Step 2

User Vault generates proof locally (consentId, nullifier as public signals).

---

Step 3

Proof sent to Service Provider.

---

Step 4

Service Provider calls verifyAccess(consentId, pA, pB, pC, nullifier).

---

Step 5

Smart Contract validates:

- consent status is ACTIVE
- nullifier has not been used before
- ZK proof is valid (via Groth16Verifier)

---

Step 6

Smart Contract marks nullifier as used.

---

Step 7

Access granted. Event emitted.

---

# Revocation Flow

Step 1

User clicks Forget Me.

---

Step 2

User signs transaction.

---

Step 3

revokeConsent() executed.

---

Step 4

Consent becomes REVOKED.

---

Step 5

Future verification attempts fail.

---

# Cryptographic Erasure Flow

Traditional Model:

Delete data.

RightToBeForgotten Model:

Destroy authorization validity.

Result:

- User cannot be verified.
- Consent becomes unusable.
- Access becomes impossible.

---

# Smart Contract Architecture

## ConsentRegistry.sol

Responsibilities:

- registerConsent()
- revokeConsent()
- verifyAccess() with ZK proof verification
- Track used nullifiers to prevent replay attacks

Storage:

mapping(bytes32 => uint8) Consent State

mapping(bytes32 => bool) Used Nullifiers

Enum:

0 = NOT_REGISTERED

1 = ACTIVE

2 = REVOKED

Events:

event ConsentRegistered(bytes32 indexed consentId, address indexed registrant)

event ConsentRevoked(bytes32 indexed consentId, address indexed revoker)

event AccessVerified(bytes32 indexed consentId, bool result)

---

## Verifier.sol (Groth16Verifier)

Generated from Circom via snarkJS.

Responsibilities:

- Verify Groth16 ZK proof.
- Return valid/invalid result.
- Pure view function (no state changes).

---

# Phase 3 Integration Architecture

ConsentRegistry acts as the orchestrator. It accepts proof submissions, validates consent state, calls Groth16Verifier for proof verification, and tracks nullifiers.

Flow:

1. Service Provider calls verifyAccess(consentId, pA, pB, pC, nullifier)
2. ConsentRegistry checks consent state is ACTIVE
3. ConsentRegistry checks nullifier has not been used
4. ConsentRegistry calls Groth16Verifier.verifyProof(pA, pB, pC, [consentId, nullifier])
5. If proof valid, ConsentRegistry marks nullifier as used
6. ConsentRegistry emits AccessVerified event
7. Returns true/false

Security properties:

- Proof replay prevented by nullifier tracking
- Cross-service linking prevented by per-consent nullifier scope
- Revocation enforced by state check before proof verification
- CEI pattern applied for reentrancy safety

Known Limitation (PoC):

Potential mempool front-running: an attacker observing a proof in the mempool could theoretically extract the nullifier and attempt to front-run the transaction. However, this is not exploitable because the nullifier can only be marked as used after a valid proof is verified. Without knowledge of userSecret, the attacker cannot produce a valid proof for the same nullifier. In a production system, commit-reveal schemes or private mempools could provide additional protection.

---

# Frontend Architecture

## Identity Storage

Technology:

IndexedDB with PBKDF2 + AES-GCM encryption.

Storage Keys:

- userSecret: random 256-bit integer
- consentVersion: monotonically increasing integer per spId

Encryption:

Identity is encrypted at rest using a key derived from the user's passphrase via PBKDF2. In development mode, auto-unlock may be used for demo purposes.

Production deployments must require passphrase unlock (FER-06).

---

## Wallet Integration

Technology:

Wagmi v2 + ConnectKit.

Purpose:

- Connect user wallet (MetaMask, WalletConnect)
- Sign transactions (registerConsent, revokeConsent)
- Read on-chain state (getConsentState, isConsentActive)

Wallet address is NOT used as identity. Identity is separate from wallet.

---

## Proof Generation

Technology:

SnarkJS (browser-side, using WASM).

Inputs:

- userSecret (from encrypted identity store)
- spId (service provider wallet address, as uint256)
- consentVersion (from encrypted identity store)
- consentId (computed: poseidon(userSecret, spId, consentVersion))
- nullifier (computed: poseidon(userSecret, consentId, spId))

Output:

- proof (a, b, c points)
- publicSignals ([consentId, nullifier])

Execution:

Proof generation runs in a Web Worker to avoid blocking the UI thread.

Circuit files (consent.wasm, consent_final.zkey) are served from /public/circuits/.

---

## User Vault Pages

/

Landing Page

---

/dashboard

Consent Dashboard

Displays all registered consents, their status, and service provider details.

---

/consent

Consent Management

Register new consent for a service provider. Requires spId input.

---

/revoke

Forget Me Workflow

Revoke active consent. Requires wallet signature and confirmation.

---

/identity

Identity Management

View identity status, export/backup identity, import identity from backup.

---

# Service Provider Pages

/

Login With Privacy

Service provider initiates verification request. User generates proof client-side and submits to service provider.

---

/verify

Verification Status

Displays verification result. Calls verifyAccess() on ConsentRegistry.

---

/access

Protected Content

Content accessible only after successful verification.

---

# Monorepo Structure

root/

apps/
│
├── user-vault/
│
└── service-provider/

contracts/
│
├── src/
│ ├── ConsentRegistry.sol
│ └── Verifier.sol
│
├── test/
│
├── deploy/
│
├── hardhat.config.ts
│
└── package.json

circuits/
│
├── src/
│ └── consent.circom
│
├── build/
│
├── proofs/
│
└── package.json

docs/
│
├── Scope.md
├── Architecture.md
├── Security.md
├── PRD.md
├── Task.md
├── Workflow.md
│
└── adr/
├── ADR-001-groth16.md
├── ADR-002-circom.md
└── ADR-003-polygon-amoy.md

scripts/
│
└── README.md

---

# Environment Strategy

Development

Local Hardhat Network

---

Testing

Polygon Amoy Testnet

---

Production

Not included in project scope.

---

# Design Principles

1. Privacy First
2. Minimal Trust
3. Explicit Verification
4. Revocation Finality
5. Local Proof Generation
6. User Ownership
7. Security Before Convenience

---

# Architecture Success Criteria

The architecture is successful when:

- Users can generate identities.
- Users can register consent.
- Users can generate proofs.
- Service providers can verify proofs.
- Revocation permanently disables verification.
- No personally identifiable information is stored on-chain.
- End-to-end workflow operates correctly.
