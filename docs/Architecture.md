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

- secret
- nullifier

Generated locally.

Stored locally.

Never transmitted directly.

Never stored on-chain.

---

# Consent Architecture

Consent is represented by:

ConsentID

Derived from:

poseidon(userSecret, serviceProviderId)

Properties:

- Unique
- Deterministic
- Verifiable
- Privacy-preserving

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

User Vault generates proof.

---

Step 3

Proof sent to Service Provider.

---

Step 4

Service Provider calls verifyAccess().

---

Step 5

Smart Contract validates:

- proof validity
- consent status

---

Step 6

Access granted.

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
- verifyAccess()

Storage:

mapping(bytes32 => uint8) Consent State

Enum:

0 = NOT_REGISTERED

1 = ACTIVE

2 = REVOKED

Events:

event ConsentRegistered(bytes32 indexed consentId, address indexed registrant)

event ConsentRevoked(bytes32 indexed consentId, address indexed revoker)

event AccessVerified(bytes32 indexed consentId, bool result)

---

## Verifier.sol

Generated from Circom.

Responsibilities:

- Verify zk-proof.
- Return valid/invalid result.

---

# Frontend Architecture

## User Vault Pages

/

Landing Page

---

/dashboard

Consent Dashboard

---

/consent

Consent Management

---

/revoke

Forget Me Workflow

---

# Service Provider Pages

/

Login With Privacy

---

/verify

Verification Status

---

/access

Protected Content

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
├── ConsentRegistry.sol
│
└── Verifier.sol

circuits/
│
├── consent.circom
│
├── build/
│
└── proofs/

docs/
│
├── scope.md
├── architecture.md
├── security.md
├── prd.md
├── tasks.md

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
