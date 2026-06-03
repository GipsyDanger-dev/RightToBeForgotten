# ADR-001: Pilihan Groth16 sebagai Proof System

**Status:** Accepted

**Date:** 2026-06-04

---

## Context

RightToBeForgotten membutuhkan zero-knowledge proof system untuk memverifikasi consent tanpa mengungkap identitas user. Proof system harus:
- Menghasilkan proof yang ringkas (small proof size)
- Verifikasi yang cepat di on-chain (low gas cost)
- Mature dan battle-tested
- Kompatibel dengan Circom

Opsi yang dipertimbangkan:
1. **Groth16** — proof size terkecil, verifikasi paling cepat, tapi memerlukan trusted setup per circuit
2. **PLONK** — universal trusted setup, tapi proof lebih besar dan verifikasi lebih mahal
3. **STARK** — no trusted setup, tapi proof sangat besar dan verifikasi sangat mahal di on-chain

---

## Decision

Gunakan **Groth16** sebagai proof system.

---

## Consequences

**Positif:**
- Proof size ~128 bytes (terkecil di antara opsi)
- Verifikasi di Ethereum hanya ~200k gas (paling murah)
- Ekosistem Circom + SnarkJS sangat mendukung Groth16
- Banyak referensi dan dokumentasi

**Negatif:**
- Memerlukan trusted setup ceremony per circuit
- Tidak universal (setup berbeda untuk circuit berbeda)
- Jika toxic waste bocor, proof bisa di-forge

**Mitigasi:**
- Trusted setup dilakukan dengan kontribusi yang cukup
- Toxic waste dihapus setelah ceremony
- Untuk proof-of-concept, trusted setup sederhana sudah memadai
