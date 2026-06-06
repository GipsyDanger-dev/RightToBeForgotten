# ADR-001: Choice of Groth16 as Proof System

**Status:** Accepted

**Date:** 2026-06-04

---

## Context

RightToBeForgotten requires a zero-knowledge proof system to verify consent without revealing the user's identity. The proof system must:

- Produce concise proofs (small proof size)
- Enable fast on-chain verification (low gas cost)
- Be mature and battle-tested
- Be compatible with Circom

Options considered:

1. **Groth16** — smallest proof size, fastest verification, but requires trusted setup per circuit
2. **PLONK** — universal trusted setup, but larger proofs and more expensive verification
3. **STARK** — no trusted setup, but very large proofs and very expensive on-chain verification

---

## Decision

Use **Groth16** as the proof system.

---

## Consequences

**Positive:**

- Proof size ~128 bytes (smallest among options)
- Verification on Ethereum costs only ~200k gas (cheapest)
- Circom + SnarkJS ecosystem has strong Groth16 support
- Extensive references and documentation available

**Negative:**

- Requires trusted setup ceremony per circuit
- Not universal (different setup for different circuits)
- If toxic waste leaks, proofs can be forged

**Mitigations:**

- Trusted setup performed with sufficient contributions
- Toxic waste deleted after ceremony
- For a proof-of-concept, a simple trusted setup is adequate
