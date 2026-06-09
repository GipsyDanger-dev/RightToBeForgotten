# DEMO_SCRIPT.md

# RightToBeForgotten

5-Minute Live Demo Script

---

# Pre-Demo Checklist

- [ ] Local Hardhat node running (`cd contracts && npx hardhat node`)
- [ ] Contracts deployed locally (`npx hardhat run deploy/deploy-consent-registry.ts --network localhost`)
- [ ] User Vault running (`cd apps/user-vault && npm run dev`)
- [ ] Service Provider running (`cd apps/service-provider && npm run dev`)
- [ ] MetaMask connected to localhost (Chain ID 31337)
- [ ] MetaMask has test ETH from Hardhat node
- [ ] Browser tabs open: User Vault (localhost:3000), Service Provider (localhost:3001)

---

# Demo Script (5 minutes)

## Opening (30 seconds)

> "RightToBeForgotten demonstrates how the Right to be Forgotten can work on a blockchain. The problem: blockchain data is immutable, but privacy laws like GDPR give users the right to erasure. The solution: instead of deleting data, we destroy the ability to verify it — using Zero-Knowledge Proofs."

---

## Part 1: Identity Generation (30 seconds)

**Navigate to:** User Vault → Identity page

> "First, the user generates a cryptographic identity. This is a random 256-bit secret that exists only on their device. It's encrypted with a passphrase using PBKDF2 and AES-GCM, stored in IndexedDB. The wallet address is separate — the identity is independent of any blockchain account."

**Action:** Click "Create Identity", enter passphrase, show identity created.

> "The identity is now created. The userSecret is never transmitted anywhere."

---

## Part 2: Consent Registration (45 seconds)

**Navigate to:** User Vault → Consent page

> "Now let's register consent for a service provider. The service provider is identified by their wallet address — the spId. The system derives a consentId using the Poseidon hash function: poseidon(userSecret, spId, consentVersion). This is deterministic but privacy-preserving — you can't reverse-engineer the secret from the consentId."

**Action:** Enter a service provider wallet address, click "Register Consent".

> "This sends a transaction to the ConsentRegistry smart contract on Polygon. The consent is now ACTIVE on-chain."

---

## Part 3: Proof Generation (45 seconds)

**Navigate to:** User Vault → Generate Proof page

> "Now the user generates a Zero-Knowledge Proof. This happens entirely in the browser — the secret never leaves the device. The proof demonstrates: 'I know a secret that hashes to this consentId, and I'm authorized by this service provider.' Without revealing the secret itself."

**Action:** Click "Generate Proof", wait for generation.

> "The proof is generated using Groth16 — about 256 bytes. It includes two public signals: the consentId and a nullifier. The nullifier is unique per consent and prevents replay attacks."

---

## Part 4: Access Verification (45 seconds)

**Navigate to:** Service Provider → Login page

> "The service provider receives the proof and submits it to the smart contract. The contract checks three things: is the consent active? Has this nullifier been used before? Is the ZK proof valid?"

**Action:** Paste proof data, click "Verify Access".

> "Access verified. The contract verified the proof on-chain using the Groth16Verifier. The nullifier is now marked as used — this exact proof can never be submitted again."

**Navigate to:** Service Provider → Access page

> "The user can now access protected content."

---

## Part 5: Revocation — "Forget Me" (45 seconds)

**Navigate to:** User Vault → Revoke page

> "Now the user exercises the Right to be Forgotten. They select the consent and click 'Forget Me'. This calls revokeConsent() on the smart contract."

**Action:** Select consent, confirm, click "Forget Me".

> "The consent state is now REVOKED. This is permanent — there's no undo button. The smart contract enforces this at the code level."

---

## Part 6: Verification Failure (30 seconds)

**Navigate to:** Service Provider → Login page

> "Let's try to verify the same proof again."

**Action:** Submit same proof, click "Verify Access".

> "Access denied. The contract checks consent state first — it's REVOKED, so verification fails immediately, before even checking the proof. The service provider has permanently lost the ability to verify this user."

---

## Part 7: Re-consent (30 seconds)

**Navigate to:** User Vault → Consent page

> "But the user isn't locked out forever. They can register new consent with the same service provider using consentVersion=2. This creates a new consentId — the old one remains permanently revoked."

**Action:** Register new consent for same SP.

> "New consent is active. The old consentId is still revoked. This is how re-consent works — each version is independent."

---

## Closing (15 seconds)

> "That's the complete lifecycle: identity generation, consent registration, ZK proof verification, permanent revocation, and re-consent. The key insight is that we never delete data — we destroy the cryptographic ability to use it. This is how privacy rights can coexist with blockchain immutability."

---

# Key Demo Points

1. **Identity is local** — never transmitted, encrypted at rest
2. **Proofs are zero-knowledge** — verify without revealing
3. **Revocation is permanent** — enforced by smart contract
4. **Replay prevention** — nullifiers can only be used once
5. **Re-consent is possible** — consentVersion enables new generations

---

# Troubleshooting

| Issue                     | Solution                                                |
| ------------------------- | ------------------------------------------------------- |
| MetaMask not connecting   | Ensure localhost:8545 is added as network               |
| Transaction fails         | Check Hardhat node is running, wallet has ETH           |
| Proof generation slow     | Normal — takes 5-10 seconds in browser                  |
| "Chain not found"         | Add localhost network to MetaMask (Chain ID 31337)      |
| Circuit files not loading | Check `apps/user-vault/public/circuits/` has both files |

---

# Alternative: Polygon Amoy Demo

For testnet demo instead of local:

1. Switch MetaMask to Polygon Amoy (Chain ID 80002)
2. Use deployed contract address: `0xa78Ad9B4bD61950ba670AAfFb8d1235c93c3BaBA`
3. Get testnet MATIC from https://faucet.polygon.technology/
4. Set `NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS` in `.env.local`
5. Start both apps with `npm run dev`

---

# Demo Variations

## 2-Minute Version

Skip Parts 1-2 (identity and registration). Start from Part 3 with pre-registered consent.

## 10-Minute Version

Add:

- Show contract on Polygonscan (events, state)
- Explain the ZKP circuit in detail
- Show the nullifier tracking on-chain
- Demonstrate replay attack prevention (submit same proof twice)
- Show gas costs on each transaction

## Technical Deep-Dive (15 minutes)

Add after main demo:

- Open `circuits/src/consent.circom` and explain constraints
- Open `ConsentRegistry.sol` and walk through verifyAccess()
- Show the Poseidon hash derivation
- Explain the CEI pattern
- Show the circuit integrity verification (FER-08)
