# Security.md

# RightToBeForgotten

Security Requirements, Threat Model, and Privacy Assumptions

---

# Purpose

This document defines the security model, privacy guarantees, trust assumptions, threat landscape, and security requirements for the RightToBeForgotten system.

All implementation decisions must comply with this document.

If implementation conflicts with security requirements, security requirements take precedence.

---

# Security Objectives

The system must guarantee:

1. Privacy Preservation
2. Consent Integrity
3. Consent Revocation Finality
4. Verification Correctness
5. User Sovereignty
6. Minimal Trust
7. Cryptographic Soundness

---

# Security Principles

## Privacy First

Privacy requirements always take priority over convenience.

---

## Least Trust

Trust assumptions must be minimized whenever possible.

---

## Explicit Verification

Every sensitive operation must be verified explicitly.

---

## Fail Secure

When verification fails, access must be denied.

Never grant access by default.

---

## Revocation Finality

A revoked consent must remain revoked permanently.

No recovery mechanism may reactivate revoked consent.

---

# Assets To Protect

The following assets are considered sensitive.

## User Secret

Purpose:

Used to generate identity commitments and proofs.

Security Requirement:

Must never leave the user's device.

---

## Nullifier

Purpose:

Uniquely identifies proof ownership and prevents abuse.

Scope:

Per-consent. Derived from poseidon(userSecret, consentId, serviceProviderId).

This prevents cross-service linking: even if the same user interacts with multiple service providers, each nullifier is unique to the consent relationship.

Security Requirement:

Must never be exposed unnecessarily.

---

## Consent Identity

Purpose:

Represents a user's relationship with a service provider.

Security Requirement:

Must not reveal user identity.

---

## Proof Generation Keys

Purpose:

Generate valid ZK proofs.

Security Requirement:

Must be protected from manipulation.

---

## Verification Keys

Purpose:

Verify proof validity.

Security Requirement:

Must match approved circuit versions.

---

# Privacy Guarantees

The system aims to provide:

## Identity Privacy

Service providers should not learn:

- User secret
- Private identity values
- Internal commitment values

---

## Verification Privacy

Verification should reveal only:

- Proof validity
- Consent validity

Nothing else.

---

## Relationship Privacy

Third parties should not be able to determine:

- Which user owns a consent
- Which consent belongs to a specific identity

---

# Trust Assumptions

The following assumptions are accepted.

## Blockchain Integrity

Assume blockchain consensus remains secure.

---

## Cryptographic Primitive Integrity

Assume approved cryptographic primitives remain secure.

Examples:

- Poseidon
- Groth16
- BN254

If vulnerabilities are discovered, migration planning is required.

---

## User Device Assumption

Assume user device is not actively compromised.

If the user's device is compromised:

- Privacy guarantees may fail.
- Secret protection may fail.

---

# Threat Model

## Threat Actor 1

Malicious Service Provider

Goal:

Attempt to access user data after revocation.

Mitigation:

- On-chain consent validation
- Revocation finality
- Proof verification

Expected Result:

Access denied.

---

## Threat Actor 2

External Observer

Goal:

Link blockchain activity to user identity.

Mitigation:

- Zero-Knowledge Proofs
- Hidden identity commitments
- Minimal public information

Expected Result:

Identity remains private.

---

## Threat Actor 3

Malicious User

Goal:

Forge access permissions.

Mitigation:

- Cryptographic proof verification
- Consent validation
- Smart contract verification

Expected Result:

Proof rejected.

---

## Threat Actor 4

Replay Attacker

Goal:

Reuse old proof submissions.

Mitigation:

- Nullifier design
- Proof freshness mechanisms

Expected Result:

Replay attack rejected.

---

## Threat Actor 5

Smart Contract Attacker

Goal:

Manipulate consent status.

Mitigation:

- Access control
- Immutable revocation logic
- Explicit state validation

Expected Result:

Unauthorized changes prevented.

---

# Smart Contract Security Requirements

## SCR-01

Consent registration must be validated.

---

## SCR-02

Consent revocation must be irreversible.

---

## SCR-03

Verification must fail when consent is inactive.

---

## SCR-04

State transitions must be explicit.

---

## SCR-05

No hidden administrative override may exist.

---

## SCR-06

Contracts must avoid unnecessary complexity.

---

## SCR-07

Contract functions must be protected against reentrancy attacks.

Use ReentrancyGuard or Checks-Effects-Interactions pattern.

---

# ZKP Security Requirements

## ZKR-01

Private inputs must never become public outputs.

---

## ZKR-02

Proof validity must depend on consent ownership.

---

## ZKR-03

Proof generation must occur locally whenever possible.

---

## ZKR-04

Verification logic must match deployed circuit versions.

---

## ZKR-05

Circuit modifications require user approval.

---

# Frontend Security Requirements

## FER-01

Sensitive values must not be logged.

---

## FER-02

Sensitive values must not be exposed through URLs.

---

## FER-03

Sensitive values must not be stored in analytics systems.

---

## FER-04

Proof generation should occur locally.

---

## FER-05

User actions must be confirmed before irreversible operations.

---

# Revocation Security Model

The system implements Cryptographic Erasure.

Definition:

The system does not attempt to delete blockchain data.

Instead:

The system permanently destroys the ability to prove authorization.

Result:

- Identity becomes unusable.
- Authorization becomes invalid.
- Future verification fails.

---

# Security Review Checklist

Before implementation of any feature:

## Review Required

- Threat analysis
- Attack surface analysis
- Privacy impact analysis
- Cryptographic assumptions review

---

## Questions

1. What asset is being protected?
2. Who is the attacker?
3. What is the attack path?
4. What is the mitigation?
5. What happens if mitigation fails?

All questions must be answered before implementation.

---

# Incident Response

If a vulnerability is discovered:

1. Stop implementation.
2. Document the issue.
3. Assess impact.
4. Present findings to the user.
5. Wait for approval before remediation.

---

# Security Approval Rule

The following changes require explicit user approval:

- Circuit redesign
- Cryptographic primitive replacement
- Smart contract redesign
- Identity model changes
- Consent model changes
- Revocation model changes

Implementation must not proceed until approval is granted.

---

# Definition of Secure

A component is considered secure only when:

- Threats are documented.
- Assumptions are documented.
- Mitigations are documented.
- Privacy guarantees are preserved.
- Security review is completed.
- User approval requirements are respected.
