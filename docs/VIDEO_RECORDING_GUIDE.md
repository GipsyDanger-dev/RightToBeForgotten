# VIDEO_RECORDING_GUIDE.md

# RightToBeForgotten

Demo Video Recording Guide

---

# Purpose

This guide prepares the final missing deliverable from `docs/Task.md` — the
**demo video**. It adapts `docs/DEMO_SCRIPT.md` (written for a local Hardhat
demo) to the **live VPS deployment** (User Vault + Service Provider served
over HTTPS), with a scene-by-scene shot list, recording settings, and a
post-production checklist.

> Companion document: `docs/DEMO_SCRIPT.md` — contains the full 5-minute
> narration script. This guide covers _how_ to record it.

---

# Demo Variants

| Variant         | Environment                                        | When to use                              |
| --------------- | -------------------------------------------------- | ---------------------------------------- |
| **Live VPS**    | `https://<vault-domain>` + `https://<sp-domain>`   | Recommended — matches current deployment |
| Local (Hardhat) | `localhost:3000` + `localhost:3001` + Hardhat node | Fallback if VPS is unavailable           |

This guide assumes the **Live VPS** variant. Use real contract addresses on
Polygon Amoy:

- ConsentRegistry: `0xa78Ad9B4bD61950ba670AAfFb8d1235c93c3BaBA`
- Groth16Verifier: `0xea39f8283fd5Ce927EE913Bd4f55b52Ec2AFA9E0`
- Explorer: `https://amoy.polygonscan.com`

---

# Pre-Recording Checklist

## Technical

- [ ] Both live sites load over HTTPS: `<vault-domain>` and `<sp-domain>`
- [ ] Circuit file served: `https://<vault-domain>/circuits/consent.wasm` returns 200
- [ ] MetaMask installed and logged in (or fresh)
- [ ] Polygon Amoy network added to MetaMask (Chain ID `80002`)
  - RPC: `https://polygon-amoy.drpc.org`
  - Fallback: `https://polygon-amoy-bor-rpc.publicnode.com`
- [ ] Wallet funded with testnet POL (faucet: https://faucet.polygon.technology/)
  - Needs ~0.01 POL to cover `registerConsent` (~75k gas) + `revokeConsent` (~37k gas)
- [ ] Browser privacy/incognito window used for a clean start (fresh IndexedDB)
- [ ] Display resolution ≥ 1920×1080; browser window maximized
- [ ] No sensitive tabs/windows visible (emails, other wallets)

## Content

- [ ] Have the narration (`docs/DEMO_SCRIPT.md`) printed or on a second screen
- [ ] Decide the demo scope: 5-minute standard, 2-minute flash, or 10-minute deep-dive
- [ ] Pre-write the **service provider wallet address** (spId) you will paste
- [ ] Pre-write the consent version used (starts at 1; use 2 for the re-consent scene)

---

# Recording Software (OBS Recommended)

| Setting       | Value                                              |
| ------------- | -------------------------------------------------- |
| Canvas        | 1920×1080 (or 2560×1440 for zoomed UI)             |
| FPS           | 30                                                 |
| Encoder       | x264 or NVENC, CBR 12–16 Mbps                      |
| Audio         | 48 kHz, 160–192 kbps                               |
| Output format | MP4 (MKV while recording, remux after)             |
| Sources       | Window capture of browser + mic                    |
| Mouse cursor  | Visible, enlarged (Settings → Appearance → Cursor) |

Tips:

- Record in **private/incognito** so wallet/extension state starts clean.
- Turn on macOS/Windows **focus mode** to block notifications.
- Do 1–2 **practice takes** of proof generation (it takes 5–10 s in browser) so
  you know where to pause talking.

---

# Scene-by-Scene Shot List

Timing totals **5 minutes** (per `docs/DEMO_SCRIPT.md`). On-screen callouts
(suggested lower-third text) are listed per scene.

## 0. Opening — 30 s

| Item    | Detail                                                    |
| ------- | --------------------------------------------------------- |
| Visual  | Full screen of `<vault-domain>` landing page              |
| Audio   | Narrate the problem: immutable blockchain vs GDPR erasure |
| Callout | "ZKP + Cryptographic Erasure"                             |

## 1. Identity Generation — 30 s

| Item    | Detail                                                           |
| ------- | ---------------------------------------------------------------- |
| Visual  | Vault → Identity page; click "Create Identity"; enter passphrase |
| Audio   | 256-bit secret, PBKDF2 + AES-GCM, IndexedDB, wallet-independent  |
| Callout | "Secret never leaves this device"                                |
| ⚠️      | Do **not** display the exported identity file contents in full   |

## 2. Consent Registration — 45 s

| Item       | Detail                                                                          |
| ---------- | ------------------------------------------------------------------------------- |
| Visual     | Vault → Consent page; paste spId; click "Register Consent"; confirm in MetaMask |
| Audio      | consentId = poseidon(userSecret, spId, consentVersion)                          |
| Callout    | "Consent is now ACTIVE on-chain"                                                |
| Bonus shot | After the TX lands, show the TX on amoy.polygonscan.com (paste TX hash)         |

## 3. Proof Generation — 45 s

| Item    | Detail                                                                |
| ------- | --------------------------------------------------------------------- |
| Visual  | Vault → proof generation UI; click "Generate Proof"; wait for Groth16 |
| Audio   | Local, client-side proof; public signals consentId + nullifier        |
| Callout | "Zero-knowledge: verify without revealing"                            |
| ⚠️      | Proof generation takes 5–10 s — keep talking or cut the wait          |

## 4. Access Verification — 45 s

| Item       | Detail                                                                   |
| ---------- | ------------------------------------------------------------------------ |
| Visual     | Switch to `<sp-domain>`; login page; submit proof; click "Verify Access" |
| Audio      | Contract checks: consent ACTIVE, nullifier unused, proof valid           |
| Callout    | "Access granted — nullifier marked as used"                              |
| Bonus shot | Show `AccessVerified: true` event on Polygonscan                         |

## 5. Revocation ("Forget Me") — 45 s

| Item       | Detail                                                                      |
| ---------- | --------------------------------------------------------------------------- |
| Visual     | Vault → Revoke page; select consent; click "Forget Me"; confirm in MetaMask |
| Audio      | REVOKED is a terminal state — no undo, enforced in Solidity                 |
| Callout    | "REVOKED — permanent"                                                       |
| Bonus shot | Polygonscan: state=2, `ConsentRevoked` event                                |

## 6. Verification Failure — 30 s

| Item    | Detail                                                                    |
| ------- | ------------------------------------------------------------------------- |
| Visual  | Back to `<sp-domain>`; submit the same proof; "Verify Access"             |
| Audio   | Contract early-exits: consent state != ACTIVE → denied before proof check |
| Callout | "Access denied — permanently"                                             |

## 7. Re-consent — 30 s

| Item    | Detail                                                                      |
| ------- | --------------------------------------------------------------------------- |
| Visual  | Vault → Consent page; register again (consentVersion=2); show new consentId |
| Audio   | Old consentId stays REVOKED; new generation is ACTIVE                       |
| Callout | "consentVersion=2 — a fresh generation"                                     |

## 8. Closing — 15 s

| Item    | Detail                                                         |
| ------- | -------------------------------------------------------------- |
| Visual  | Back to landing page or a summary card                         |
| Audio   | Key insight: never delete data — destroy the ability to use it |
| Callout | "Privacy rights × blockchain immutability"                     |

---

# Post-Production Checklist

- [ ] Cut dead time: proof-generation waits, MetaMask popup lags
- [ ] Add lower-third captions for the callouts above (readable at 1080p)
- [ ] Add subtle zoom on tiny UI text (wallet address, TX hashes)
- [ ] Blur/remove any screen region that reveals the wallet's full private key or exported identity file
- [ ] Final narration pass: check the 5 key demo points (from DEMO_SCRIPT.md):
  1. Identity is local
  2. Proofs are zero-knowledge
  3. Revocation is permanent
  4. Replay prevention (nullifiers)
  5. Re-consent is possible
- [ ] Export: MP4 (H.264 + AAC), 1920×1080, ≤ 100 MB
- [ ] Upload (YouTube unlisted first for review)
- [ ] After publication, tick the final item in `docs/Task.md` completion checklist and mark the project **COMPLETE**

---

# Troubleshooting During Recording

| Symptom                                 | Fix                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------- |
| MetaMask "Chain not found"              | Add Polygon Amoy (Chain ID 80002) in MetaMask → Networks                    |
| Transaction fails (out of gas)          | Fund wallet from faucet.polygon.technology; needs ~0.01 POL                 |
| Proof generation is slow                | Normal (5–10 s). Cut the wait in editing or narrate over it                 |
| Circuit file 404                        | Verify `https://<vault-domain>/circuits/consent.wasm` (must be 200)         |
| WalletConnect prompt hangs              | Use the injected MetaMask provider; WalletConnect 'demo' ID is rate-limited |
| Recorded UI text too small              | Re-record that scene with browser zoom (Ctrl/Cmd +)                         |
| Identity was created in an earlier take | Use incognito window per take, or delete IndexedDB before take 2            |

---

# Recording Runtime Cheat Sheet

| Section    | Duration |
| ---------- | -------- |
| Opening    | 0:30     |
| Identity   | 0:30     |
| Register   | 0:45     |
| Proof      | 0:45     |
| Verify     | 0:45     |
| Revoke     | 0:45     |
| Denied     | 0:30     |
| Re-consent | 0:30     |
| Closing    | 0:15     |
| **Total**  | **5:15** |
