# ADR-002: Choice of Circom as Circuit Language

**Status:** Accepted

**Date:** 2026-06-04

---

## Context

RightToBeForgotten requires a domain-specific language for defining ZKP circuits. The circuit language must:

- Be understandable by developers who are not cryptography experts
- Have a rich standard library (hash, comparison, etc.)
- Produce R1CS compatible with Groth16
- Have mature tooling

Options considered:

1. **Circom** — most popular DSL for ZKP, comprehensive circomlib library, large community
2. **Halo2** — from Zcash, more flexible, but steeper learning curve
3. **Noir** — new, interesting, but ecosystem not yet mature

---

## Decision

Use **Circom** (v2) as the circuit language, with **SnarkJS** as the proving/verification library.

---

## Consequences

**Positive:**

- Relatively easy-to-understand syntax
- circomlib provides standard components: Poseidon, MiMC, comparators, etc.
- SnarkJS runs in the browser (local witness generation)
- Native integration with Groth16
- Abundant documentation and tutorials

**Negative:**

- R1CS-based (less flexible than other arithmetization schemes)
- Circuit debugging can be difficult
- Compile time can be long for large circuits

**Mitigations:**

- The circuit in this project is relatively simple
- Thorough testing to verify circuit correctness
