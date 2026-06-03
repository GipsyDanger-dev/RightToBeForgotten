# ADR-002: Pilihan Circom sebagai Circuit Language

**Status:** Accepted

**Date:** 2026-06-04

---

## Context

RightToBeForgotten membutuhkan domain-specific language untuk mendefinisikan ZKP circuits. Circuit harus:
- Mudah dipahami oleh developer yang tidak ahli kriptografi
- Punya library standar yang kaya (hash, comparison, dll.)
- Menghasilkan R1CS yang kompatibel dengan Groth16
- Punya tooling yang mature

Opsi yang dipertimbangkan:
1. **Circom** — DSL paling populer untuk ZKP, library circomlib lengkap, komunitas besar
2. **Halo2** — dari Zcash, lebih fleksibel, tapi kurva belajar lebih curam
3. **Noir** — baru, menarik, tapi ekosistem belum matang

---

## Decision

Gunakan **Circom** (v2) sebagai circuit language, dengan **SnarkJS** sebagai proving/verification library.

---

## Consequences

**Positif:**
- Sintaks yang relatif mudah dipahami
- circomlib menyediakan komponen standar: Poseidon, MiMC, comparators, dll.
- SnarkJS berjalan di browser (witness generation lokal)
- Integrasi dengan Groth16 native
- Dokumentasi dan tutorial berlimpah

**Negatif:**
- R1CS-based (kurang fleksibel dibanding arithmetization lain)
- Debugging circuit bisa sulit
- Compile time bisa lama untuk circuit besar

**Mitigasi:**
- Circuit dalam project ini relatif sederhana
- Testing menyeluruh untuk memverifikasi kebenaran circuit
