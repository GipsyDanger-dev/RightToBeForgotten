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

COMPLETED

Tasks:

- [x] Setup Hardhat
- [x] Configure Polygon Amoy
- [x] Create ConsentRegistry.sol
- [x] Implement registerConsent()
- [x] Implement revokeConsent()
- [x] Implement consent validation
- [x] Create deployment scripts
- [x] Create unit tests
- [x] Run security review

Deliverables:

- ConsentRegistry compiled successfully
- 20/20 unit tests passing
- Gas usage documented

Gas Report:

- registerConsent(): 67,941 gas
- revokeConsent(): 30,800 gas
- verifyAccess(): 25,506 gas
- getConsentState(): 24,076 gas (view estimate)

Dependencies:

Phase 0

---

# Phase 2

ZKP Circuit Development

Goal:

Implement privacy-preserving verification.

Status:

COMPLETED

Tasks:

- [x] Setup Circom (v2.2.3 binary)
- [x] Setup SnarkJS (v0.7.6)
- [x] Create consent.circom
- [x] Define private inputs (userSecret, spId, consentVersion)
- [x] Define public inputs (consentId, nullifier)
- [x] Implement consentId constraint: consentId === poseidon(userSecret, spId, consentVersion)
- [x] Implement nullifier constraint: nullifier === poseidon(userSecret, consentId, spId)
- [x] Generate witness
- [x] Generate proving key (trusted setup)
- [x] Generate verification key
- [x] Generate Verifier.sol
- [x] Test proof generation
- [x] Test proof verification
- [ ] Run security review

Deliverables:

- Working ZK proof system
- Verifier.sol generated and deployed (local)
- 5/5 circuit verification tests passing
- 29/29 total contract tests passing

Gas Report (Phase 2):

- verifyProof(): 221,773 gas (on-chain Groth16 verification)

Circuit Statistics:

- Non-linear constraints: 528
- Linear constraints: 682
- Public inputs: 2
- Private inputs: 3
- Wires: 1214

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

- [x] Define ConsentRegistered event
- [x] Define ConsentRevoked event
- [x] Define AccessVerified event
- [x] Implement events in ConsentRegistry.sol

Priority:

HIGH

Status:

COMPLETED (implemented in Phase 1)

Dependencies:

Phase 1

---

## DT-03

Task:

Define ZKP circuit input/output specification

Reason:

Circuit implementation requires clear specification of private inputs, public inputs, and constraints.

Tasks:

- [x] Define private inputs (userSecret, spId, consentVersion)
- [x] Define public inputs (consentId, nullifier)
- [x] Define circuit constraints
- [ ] Implement in circuit (Phase 2)
- [ ] Document signal routing

Priority:

CRITICAL

Status:

SPECIFICATION COMPLETED (implementation pending in Phase 2)

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

- [x] Measure gas cost for registerConsent() — 67,941 gas
- [x] Measure gas cost for revokeConsent() — 30,800 gas
- [x] Measure gas cost for verifyAccess() — 25,506 gas
- [x] Document gas usage — documented in Phase 1 completion
- [ ] Identify optimization opportunities

Priority:

MEDIUM

Status:

PARTIALLY COMPLETED (measurement done, optimization pending)

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
