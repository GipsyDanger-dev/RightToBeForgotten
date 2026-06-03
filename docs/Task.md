# Tasks.md

# RightToBeForgotten

Implementation Roadmap

---

# Project Status

Current Phase:

PLANNING

Status:

NOT STARTED

---

# Phase 0

Project Foundation

Goal:

Prepare repository structure and development environment.

Status:

PENDING

Tasks:

- [ ] Create monorepo structure
- [ ] Create documentation directory
- [ ] Create contracts directory
- [ ] Create circuits directory
- [ ] Create applications directory
- [ ] Configure TypeScript
- [ ] Configure ESLint
- [ ] Configure Prettier
- [ ] Configure Git hooks
- [ ] Configure environment management

Deliverables:

- Repository initialized
- Project structure completed

---

# Phase 1

Smart Contract Foundation

Goal:

Implement consent management.

Status:

PENDING

Tasks:

- [ ] Setup Hardhat
- [ ] Configure Polygon Amoy
- [ ] Create ConsentRegistry.sol
- [ ] Implement registerConsent()
- [ ] Implement revokeConsent()
- [ ] Implement consent validation
- [ ] Create deployment scripts
- [ ] Create unit tests
- [ ] Run security review

Deliverables:

- ConsentRegistry deployed locally
- Tests passing

Dependencies:

Phase 0

---

# Phase 2

ZKP Circuit Development

Goal:

Implement privacy-preserving verification.

Status:

PENDING

Tasks:

- [ ] Setup Circom
- [ ] Setup SnarkJS
- [ ] Create consent.circom
- [ ] Define private inputs
- [ ] Define public inputs
- [ ] Generate witness
- [ ] Generate proving key
- [ ] Generate verification key
- [ ] Generate verifier contract
- [ ] Test proof generation
- [ ] Test proof verification
- [ ] Run security review

Deliverables:

- Working ZK proof system

Dependencies:

Phase 1

---

# Phase 3

Smart Contract Integration

Goal:

Connect verifier contract to consent registry.

Status:

PENDING

Tasks:

- [ ] Import Verifier.sol
- [ ] Implement verifyAccess()
- [ ] Validate proof result
- [ ] Validate consent state
- [ ] Reject inactive consent
- [ ] Add integration tests
- [ ] Run security review

Deliverables:

- End-to-end verification contract

Dependencies:

Phase 2

---

# Phase 4

User Vault

Goal:

Provide user control interface.

Status:

PENDING

Tasks:

- [ ] Create Next.js application
- [ ] Configure TypeScript
- [ ] Configure TailwindCSS
- [ ] Setup wallet connection
- [ ] Generate local identity
- [ ] Create dashboard
- [ ] Create consent management page
- [ ] Create revoke workflow
- [ ] Integrate blockchain actions
- [ ] Integrate proof generation
- [ ] Run security review

Deliverables:

- Functional User Vault

Dependencies:

Phase 3

---

# Phase 5

Service Provider Demo

Goal:

Demonstrate privacy-preserving access.

Status:

PENDING

Tasks:

- [ ] Create service provider application
- [ ] Implement login with privacy
- [ ] Receive proof submission
- [ ] Call verifyAccess()
- [ ] Implement access control
- [ ] Create verification page
- [ ] Create protected page
- [ ] Run security review

Deliverables:

- Functional demo application

Dependencies:

Phase 4

---

# Phase 6

Cryptographic Erasure Validation

Goal:

Verify revocation finality.

Status:

PENDING

Tasks:

- [ ] Register consent
- [ ] Verify access
- [ ] Revoke consent
- [ ] Attempt verification again
- [ ] Confirm verification failure
- [ ] Document results

Deliverables:

- Demonstrated Right to be Forgotten workflow

Dependencies:

Phase 5

---

# Phase 7

Testing

Goal:

Validate correctness and security.

Status:

PENDING

Tasks:

- [ ] Unit tests
- [ ] Integration tests
- [ ] Contract tests
- [ ] Circuit tests
- [ ] Frontend tests
- [ ] End-to-end tests
- [ ] Security review
- [ ] Regression testing

Deliverables:

- Stable system

Dependencies:

Phase 6

---

# Phase 8

Documentation

Goal:

Complete project documentation.

Status:

PENDING

Tasks:

- [ ] Update README
- [ ] Create architecture diagrams
- [ ] Create sequence diagrams
- [ ] Document threat model
- [ ] Document gas usage
- [ ] Create setup guide
- [ ] Create deployment guide
- [ ] Create demo guide

Deliverables:

- Complete documentation

Dependencies:

Phase 7

---

# Phase 9

Portfolio Preparation

Goal:

Prepare project showcase materials.

Status:

PENDING

Tasks:

- [ ] Record demonstration video
- [ ] Capture screenshots
- [ ] Create architecture visuals
- [ ] Create portfolio summary
- [ ] Create project presentation

Deliverables:

- Portfolio-ready project

Dependencies:

Phase 8

---

# Discovered Tasks

Tasks identified during Phase 1 documentation review.

## DT-01

Task:

Create Architecture Decision Records (ADR)

Reason:

CLAUDE.md requires ADRs in docs/adr/ for major technical decisions.

Tasks:

- [x] ADR-001: Groth16 proof system
- [x] ADR-002: Circom circuit language
- [x] ADR-003: Polygon Amoy deployment target

Priority:

HIGH

Status:

COMPLETED

---

## DT-02

Task:

Define smart contract event emission specification

Reason:

FR-08 requires demonstrable audit trail. Events are the standard Ethereum mechanism.

Tasks:

- [ ] Define ConsentRegistered event
- [ ] Define ConsentRevoked event
- [ ] Define AccessVerified event
- [ ] Implement events in ConsentRegistry.sol

Priority:

HIGH

Dependencies:

Phase 1

---

## DT-03

Task:

Define ZKP circuit input/output specification

Reason:

Circuit implementation requires clear specification of private inputs, public inputs, and constraints.

Tasks:

- [ ] Define private inputs (userSecret, nullifier)
- [ ] Define public inputs (consentId, commitment)
- [ ] Define circuit constraints
- [ ] Document signal routing

Priority:

CRITICAL

Dependencies:

Phase 2

---

## DT-04

Task:

Deploy Verifier.sol to Polygon Amoy

Reason:

Verifier.sol is a deliverable in Scope.md. Must be deployed and verified on testnet.

Tasks:

- [ ] Generate Verifier.sol from circuit
- [ ] Deploy to Polygon Amoy
- [ ] Verify on block explorer
- [ ] Document contract address

Priority:

HIGH

Dependencies:

Phase 2, Phase 3

---

## DT-05

Task:

Gas optimization analysis

Reason:

Scope.md lists gas analysis as a required deliverable.

Tasks:

- [ ] Measure gas cost for registerConsent()
- [ ] Measure gas cost for revokeConsent()
- [ ] Measure gas cost for verifyAccess()
- [ ] Document gas usage
- [ ] Identify optimization opportunities

Priority:

MEDIUM

Dependencies:

Phase 3

---

## DT-06

Task:

Define proof freshness mechanism

Reason:

Security.md Threat Actor 4 mentions proof freshness but no mechanism is specified.

Tasks:

- [ ] Design nonce or timestamp mechanism
- [ ] Implement in circuit
- [ ] Implement in smart contract validation
- [ ] Test replay attack prevention

Priority:

HIGH

Dependencies:

Phase 2

---

## DT-07

Task:

Define nullifier scope and derivation

Reason:

Nullifier scope is critical for preventing cross-service linking.

Tasks:

- [x] Define per-consent scope
- [x] Define derivation formula: poseidon(userSecret, consentId, serviceProviderId)
- [ ] Implement in circuit
- [ ] Test uniqueness across services

Priority:

CRITICAL

Dependencies:

Phase 2

---

# Completion Checklist

The project is complete when:

- [ ] Consent registration works
- [ ] Proof generation works
- [ ] Proof verification works
- [ ] Revocation works
- [ ] Revocation is irreversible
- [ ] Service provider access control works
- [ ] Security review completed
- [ ] Documentation completed
- [ ] Demo video completed
- [ ] User approval obtained

Project Status:

NOT COMPLETE
