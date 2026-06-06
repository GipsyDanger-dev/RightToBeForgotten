# ADR-003: Choice of Polygon Amoy as Deployment Target

**Status:** Accepted

**Date:** 2026-06-04

---

## Context

RightToBeForgotten requires a blockchain for deploying smart contracts. The target must:

- Be an active and stable testnet
- Have low gas costs for development
- Be compatible with Ethereum tooling (Hardhat, Ethers.js/viem)
- Have a block explorer for verification

Options considered:

1. **Polygon Amoy** — official Polygon testnet, replacing Mumbai, EVM-compatible
2. **Sepolia** — Ethereum testnet, most standard, but more expensive gas
3. **Base Sepolia** — L2 testnet from Coinbase, cheap but less mature

---

## Decision

Use **Polygon Amoy Testnet** as the deployment target for testing and demo.

---

## Consequences

**Positive:**

- Very low gas costs (ideal for demo)
- EVM-compatible (Ethereum tooling works directly)
- Block explorer available (Amoy PolygonScan)
- Supports Groth16 verifier contract (precompile or Solidity)

**Negative:**

- Relatively new (replacing deprecated Mumbai)
- Faucet may require manual requests
- Network may be less stable than Sepolia

**Mitigations:**

- For a proof-of-concept, testnet stability is adequate
- Hardhat local network available for local development
- Important data only on testnet, not mainnet
