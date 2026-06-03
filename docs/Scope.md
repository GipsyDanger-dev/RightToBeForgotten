# Scope.md

# Project Name

RightToBeForgotten

---

# Project Overview

RightToBeForgotten is a decentralized privacy-preserving system that implements the Right to be Forgotten principle using Zero-Knowledge Proofs (ZKP), cryptographic revocation, and blockchain-based consent management.

Instead of attempting to delete immutable blockchain data, the system permanently revokes the ability to verify, associate, or access user-related information through a cryptographic erasure mechanism.

The project serves as a proof-of-concept demonstrating how privacy regulations such as GDPR can coexist with decentralized technologies.

---

# Project Vision

Enable users to maintain ownership and control of their digital consent while preserving privacy and complying with modern data protection principles.

The system must demonstrate that:

- Blockchain immutability and privacy rights can coexist.
- User consent can be revoked permanently.
- Identity verification can occur without identity disclosure.
- Access rights can be cryptographically destroyed.

---

# Core Objectives

## Objective 1

Provide privacy-preserving identity verification through Zero-Knowledge Proofs.

Success Criteria:

- No personally identifiable information is revealed.
- Verification occurs without exposing secrets.

---

## Objective 2

Implement decentralized consent management.

Success Criteria:

- Consent can be registered.
- Consent status is publicly verifiable.
- Consent ownership remains private.

---

## Objective 3

Implement cryptographic erasure.

Success Criteria:

- Users can permanently revoke consent.
- Revoked consent cannot be restored.
- Future verification attempts fail permanently.

---

## Objective 4

Demonstrate end-to-end workflow.

Success Criteria:

- User can register consent.
- User can generate proof.
- Service provider can verify proof.
- User can revoke consent.
- Verification becomes impossible after revocation.

---

# In Scope

The following components are included in the project.

## Zero-Knowledge Proof System

Features:

- Identity commitment generation
- Proof generation
- Proof verification
- Privacy-preserving authentication

Confirmed Technology:

- Circom
- SnarkJS
- Groth16

---

## Smart Contracts

Features:

- Consent registration
- Consent revocation
- Consent validation
- Proof verification integration

Confirmed Technology:

- Solidity
- Hardhat
- Polygon Amoy Testnet

---

## User Vault

Features:

- Identity generation
- Consent management
- Proof generation
- Consent revocation

Confirmed Technology:

- Next.js
- TypeScript
- Ethers.js

---

## Service Provider Demonstration

Features:

- Privacy login flow
- Proof submission
- Access verification
- Access denial after revocation

Confirmed Technology:

- Next.js
- TypeScript

---

## Documentation

Required Deliverables:

- Architecture diagrams
- Sequence diagrams
- Security assumptions
- Privacy model explanation
- GDPR mapping
- Gas analysis
- Demonstration guide

---

# Out of Scope

The following features must not be implemented unless explicitly approved by the user.

## Production Infrastructure

Excluded:

- Kubernetes
- Auto-scaling infrastructure
- Enterprise deployment architecture
- Multi-region deployment

---

## Real Identity Systems

Excluded:

- Government identity integration
- National ID verification
- Passport verification
- KYC providers

---

## Enterprise Features

Excluded:

- Organization management
- Team management
- RBAC systems
- Billing systems

---

## Advanced Blockchain Features

Excluded:

- Cross-chain interoperability
- Multi-chain deployment
- Layer 2 bridging
- DAO governance

---

## Advanced Recovery Systems

Excluded:

- Social recovery
- Multi-signature recovery
- Hardware wallet recovery

---

## Artificial Intelligence Features

Excluded:

- AI assistants
- LLM integrations
- AI-generated identity analysis

---

# Project Constraints

The project must satisfy the following constraints.

## Privacy First

Privacy requirements take precedence over convenience.

---

## User Ownership

Users must maintain control over consent lifecycle actions.

---

## Local Proof Generation

Proof generation should occur locally whenever possible.

---

## Minimal Trust

The architecture should minimize trust assumptions.

---

## No Centralized Identity Database

The system must not rely on a centralized identity repository.

---

# Functional Requirements

## FR-01

The system shall allow a user to create a cryptographic identity.

---

## FR-02

The system shall allow a user to register consent.

---

## FR-03

The system shall generate a unique consent identifier.

---

## FR-04

The system shall generate a valid zero-knowledge proof.

---

## FR-05

The system shall verify proofs through blockchain-integrated validation.

---

## FR-06

The system shall allow permanent consent revocation.

---

## FR-07

The system shall deny future access after revocation.

---

## FR-08

The system shall provide a demonstrable audit trail of consent state changes.

---

# Non-Functional Requirements

## Security

- No plaintext secrets stored on-chain.
- No private keys transmitted externally.
- No personally identifiable information stored on-chain.

---

## Performance

- Proof verification should complete within acceptable blockchain transaction limits.
- Frontend interactions should remain responsive.

---

## Maintainability

- Modular architecture.
- Clear separation of concerns.
- Comprehensive documentation.

---

## Auditability

- Consent status changes must be publicly verifiable.
- Revocation actions must be traceable on-chain.

---

# Expected Deliverables

## Smart Contracts

- ConsentRegistry.sol
- Verifier.sol

---

## ZKP Artifacts

- Circuit files
- Proving key
- Verification key

---

## Frontend Applications

- User Vault
- Service Provider Demo

---

## Documentation

- Scope.md
- Architecture.md
- PRD.md
- Tasks.md
- Security.md
- Agent-Rules.md
- README.md

---

# Definition of Done

The project is considered complete when:

1. Consent registration works.
2. Proof generation works.
3. Proof verification works.
4. Consent revocation works.
5. Revocation permanently blocks verification.
6. End-to-end workflow is demonstrated.
7. Documentation is complete.
8. Security review has been completed.
9. All deliverables are present.
10. User acceptance is obtained.
