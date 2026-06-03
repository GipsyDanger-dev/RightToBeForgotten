# ADR-003: Pilihan Polygon Amoy sebagai Deployment Target

**Status:** Accepted

**Date:** 2026-06-04

---

## Context

RightToBeForgotten membutuhkan blockchain untuk deploy smart contract. Target harus:

- Testnet yang aktif dan stabil
- Gas cost rendah untuk development
- Kompatibel dengan Ethereum tooling (Hardhat, Ethers.js)
- Block explorer untuk verifikasi

Opsi yang dipertimbangkan:

1. **Polygon Amoy** — testnet resmi Polygon, menggantikan Mumbai, EVM-compatible
2. **Sepolia** — testnet Ethereum, paling standar, tapi gas lebih mahal
3. **Base Sepolia** — L2 testnet dari Coinbase, murah tapi kurang mature

---

## Decision

Gunakan **Polygon Amoy Testnet** sebagai deployment target untuk testing dan demo.

---

## Consequences

**Positif:**

- Gas cost sangat rendah (ideal untuk demo)
- EVM-compatible (tooling Ethereum langsung berfungsi)
- Block explorer tersedia (Amoy PolygonScan)
- Mendukung Groth16 verifier contract (precompile atau Solidity)

**Negatif:**

- Relatif baru (menggantikan Mumbai yang sudah deprecated)
- Faucet mungkin perlu request manual
- Jaringan bisa kurang stabil dibanding Sepolia

**Mitigasi:**

- Untuk proof-of-concept, stabilitas testnet sudah memadai
- Hardhat local network tersedia untuk development lokal
- Data penting hanya di testnet, bukan mainnet
