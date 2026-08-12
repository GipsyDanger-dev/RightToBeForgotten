# Tasks.md

# RightToBeForgotten

Implementation Roadmap

---

# Project Status

Current Phase:

Phase 12 — VPS Deployment Preparation

Status:

COMPLETED

Phases Completed: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12

---

# Phase 8

Pre-Deployment Remediation

Goal:

Fix deployment script mismatches, synchronize environment configuration, and validate deployment readiness.

Status:

COMPLETED

Tasks:

- [x] Fix contracts/package.json deploy script paths (scripts/deploy.ts → deploy/deploy-consent-registry.ts)
- [x] Fix root .env.example WalletConnect variable name (NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID → NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID)
- [x] Remove dead CIRCUIT_BUILD_DIR from root .env.example
- [x] Verify contracts compile (npx hardhat compile — PASS)
- [x] Verify 43/43 contract tests pass
- [x] Verify user-vault build (6 routes — PASS)
- [x] Verify service-provider build (4 routes — PASS)
- [x] Verify deployment documentation commands match repo structure
- [x] Verify environment variable consistency across all .env.example files
- [x] Verify circuit files present with correct SHA-256 hashes

Deliverables:

- All deployment scripts point to correct paths
- All environment variables named consistently
- Both frontends build successfully
- All 43 contract tests pass
- Contracts compile successfully

Commit:

- a5ab9d3: fix: correct deployment script paths and env variable names

Dependencies:

Phase 7

---

# Phase 7

Hardening and Documentation Synchronization

Goal:

Fix documentation inconsistencies, improve security posture, and clean up technical debt.

Status:

COMPLETED

Tasks:

- [x] Fix HIGH documentation inconsistencies (8 items)
- [x] Fix MEDIUM documentation inconsistencies (8 items)
- [x] Fix Architecture.md (Ethers.js to viem, consentRegistrant, IVerifier, monorepo)
- [x] Security: Remove hardcoded dev passphrase from production builds
- [x] Security: Add error handling for silent catch blocks
- [x] Verify both apps build successfully
- [x] Update Task.md with Phase 7 status

Deliverables:

- All HIGH and MEDIUM documentation inconsistencies resolved
- Architecture.md synchronized with implementation
- Dev auto-unlock secured (runtime guard, environment-derived passphrase)
- Silent catch blocks replaced with user-visible error messages
- Both apps build: PASS

Commit Groups:

- Group 1: CLAUDE.md, Scope.md, Workflow.md (file reference fixes)
- Group 2: Architecture.md (technology stack, storage model, terminology)
- Group 3: ADR-001, ADR-002, ADR-003 (translated to English)
- Group 4: Security.md, PRD.md, .gitignore
- Group 5: identity.ts (dev passphrase security), exportIdentity fix
- Group 6: identity/page.tsx (exportIdentity call update)
- Group 7: dashboard, revoke, verify (silent catch block fixes)

Security Impact:

- Hardcoded dev passphrase removed from source code
- Runtime guard prevents devAutoUnlock in production
- Error messages now surface to users instead of being silently swallowed

Dependencies:

Phase 6

---

# Phase 0

Project Foundation

Goal:

Prepare repository structure and development environment.

Status:

COMPLETED

Tasks:

- [x] Create monorepo structure
- [x] Create documentation directory
- [x] Create contracts directory
- [x] Create circuits directory
- [x] Create applications directory
- [x] Configure TypeScript
- [x] Configure ESLint
- [x] Configure Prettier
- [x] Configure Git hooks
- [x] Configure environment management

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
- revokeConsent(): 30,823 gas
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

COMPLETED

Tasks:

- [x] Import Verifier.sol (Groth16Verifier)
- [x] Implement verifyAccess() with proof params and nullifier tracking
- [x] Validate proof result via Groth16Verifier
- [x] Validate consent state (ACTIVE check before proof verification)
- [x] Reject inactive consent (early return false)
- [x] Add integration tests (14 tests in Integration.test.ts)
- [x] Run security review (AV-01..AV-04, SCR-08/SCR-09 added)

Deliverables:

- End-to-end verification contract
- 43/43 tests passing
- Replay attack prevention via nullifier tracking

Gas Report (Phase 3):

- verifyAccess() with proof: 252,009 gas
- verifyAccess() revoked consent (early exit): 33,870 gas
- isConsentActive(): 24,090 gas (view estimate)

Dependencies:

Phase 2

---

# Phase 4

User Vault

Goal:

Provide user control interface.

Status:

COMPLETED

Tasks:

- [x] Create Next.js application
- [x] Configure TypeScript
- [x] Configure TailwindCSS
- [x] Setup wallet connection
- [x] Generate local identity
- [x] Create dashboard
- [x] Create consent management page
- [x] Create revoke workflow
- [x] Integrate blockchain actions
- [x] Integrate proof generation
- [x] Run security review

Deliverables:

- Functional User Vault
- Build: PASS (both apps)
- Type check: PASS (via build)
- 43/43 contract tests PASS
- Security review: PASS

Dependencies:

Phase 3

---

# Phase 5

Service Provider Demo

Goal:

Demonstrate privacy-preserving access.

Status:

COMPLETED

Tasks:

- [x] Create service provider application
- [x] Implement login with privacy
- [x] Receive proof submission
- [x] Call verifyAccess()
- [x] Implement access control
- [x] Create verification page
- [x] Create protected page
- [x] Run security review

Deliverables:

- Functional demo application
- Build: PASS
- Type check: PASS (via build)

Dependencies:

Phase 4

---

# Phase 6

Cryptographic Erasure Validation

Goal:

Verify revocation finality.

Status:

COMPLETED

Tasks:

- [x] Register consent (tested in ConsentRegistry.test.ts)
- [x] Verify access (tested in Integration.test.ts)
- [x] Revoke consent (tested in ConsentRegistry.test.ts)
- [x] Attempt verification again (tested in Integration.test.ts)
- [x] Confirm verification failure (tested in Integration.test.ts)
- [x] Document results (VALIDATION_REPORT.md with on-chain TX hashes)

Deliverables:

- Demonstrated Right to be Forgotten workflow
- 43/43 contract tests passing (includes revocation finality tests)

Dependencies:

Phase 5

---

# Phase 9

End-to-End Validation

Goal:

Validate deployed contracts on Polygon Amoy testnet with real ZK proofs.

Status:

COMPLETED

Tasks:

- [x] Configure apps/user-vault/.env.local for Polygon Amoy
- [x] Configure apps/service-provider/.env.local for Polygon Amoy
- [x] Flow A: Register consent → Generate ZK proof → Verify on-chain (PASS)
- [x] Flow B: Register consent → Revoke → Confirm REVOKED state (PASS)
- [x] Flow C: Re-consent after revocation with consentVersion=2 (PASS)
- [x] Replay attack prevention confirmed (nullifier reuse blocked)
- [x] Generate docs/VALIDATION_REPORT.md

Deliverables:

- All tested flows pass on Polygon Amoy
- VALIDATION_REPORT.md with TX hashes and gas costs
- Known limitation L-01 documented (full Flow B verifyAccess denial untested due to MATIC depletion)

Commit:

- 740c75b: docs: update Task.md with Phase 8 completion and renumber phases

Dependencies:

Phase 8

---

# Phase 10

Documentation

Goal:

Complete project documentation.

Status:

COMPLETED

Tasks:

- [x] Update README.md (professional rewrite with Mermaid diagrams)
- [x] Create architecture diagrams (Mermaid: system architecture, consent lifecycle, ZKP verification flow)
- [x] Create sequence diagrams (ZKP verification flow in README)
- [x] Document threat model (Security.md, PROJECT_SUMMARY.md)
- [x] Document gas usage (PROJECT_SUMMARY.md, VALIDATION_REPORT.md)
- [x] Create setup guide (README.md Getting Started)
- [x] Create deployment guide (DEPLOYMENT.md, TESTNET_DEPLOYMENT.md)
- [x] Create demo guide (DEMO_SCRIPT.md)

Deliverables:

- README.md with professional presentation
- 16 documentation files referenced and verified
- Mermaid diagrams for architecture and flows

Commit:

- 55ed3d5: docs: add portfolio materials — README, project summary, recruiter guide, demo script

Dependencies:

Phase 9

---

# Phase 11

Portfolio Preparation

Goal:

Prepare project showcase materials.

Status:

COMPLETED

Tasks:

- [x] Create docs/PROJECT_SUMMARY.md (comprehensive project summary)
- [x] Create docs/RECRUITER_GUIDE.md (interview talking points, tech stack, Q&A)
- [x] Create docs/DEMO_SCRIPT.md (5-minute live demo script with troubleshooting)
- [x] Create architecture visuals (Mermaid diagrams in README)
- [x] Verify all documentation references synchronized

Deliverables:

- PROJECT_SUMMARY.md: features, security model, GDPR alignment, ZKP details, gas analysis, limitations
- RECRUITER_GUIDE.md: 5 achievements, 6 interview Q&A, tech tables, project metrics
- DEMO_SCRIPT.md: 7-part demo, pre-checklist, troubleshooting, variations (2/5/10/15 min)

Commit:

- 55ed3d5: docs: add portfolio materials — README, project summary, recruiter guide, demo script

Dependencies:

Phase 10

---

# Phase 12

VPS Deployment Preparation

Goal:

Prepare self-hosted Docker deployment for both frontend applications (User Vault + Service Provider) on a user-owned Ubuntu VPS with automatic TLS.

Status:

COMPLETED

Tasks:

- [x] Add `output: 'standalone'` to both Next.js configs (apps/user-vault, apps/service-provider)
- [x] Create deploy/vps/user-vault.Dockerfile (3-stage: deps, builder, standalone runner)
- [x] Create deploy/vps/service-provider.Dockerfile (3-stage: deps, builder, standalone runner)
- [x] Create deploy/vps/docker-compose.yml (user-vault, service-provider, nginx-proxy, acme-companion)
- [x] Create deploy/vps/.env.example (domains, Let's Encrypt email, build-time NEXT*PUBLIC*\* vars)
- [x] Create deploy/vps/README.md (setup + troubleshooting)
- [x] Create .dockerignore (exclude node_modules, .next, secrets, .git, tooling)
- [x] Create docs/VPS_DEPLOYMENT.md (comprehensive deployment guide)
- [x] Verify standalone builds: user-vault (8 routes) PASS, service-provider (6 routes) PASS
- [x] Verify docker-compose.yml structure (4 services) PASS
- [x] Update .gitignore (.mimocode/, deploy/\*\*/.env)

Deliverables:

- Two production-ready Docker images built from Next.js standalone output
- One-command stack: `docker compose up -d --build`
- Automatic Let's Encrypt TLS via nginx-proxy + acme-companion
- Smart contracts remain on Polygon Amoy (not redeployed)

Dependencies:

Phase 11

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
- [x] Implement in circuit (Phase 2)
- [x] Document signal routing

Priority:

CRITICAL

Status:

COMPLETED (implemented in Phase 2)

Dependencies:

Phase 2

---

## DT-04

Task:

Deploy Verifier.sol to Polygon Amoy

Reason:

Verifier.sol is a deliverable in Scope.md. Must be deployed and verified on testnet.

Tasks:

- [x] Generate Verifier.sol from circuit
- [x] Deploy to Polygon Amoy (0xea39f8283fd5Ce927EE913Bd4f55b52Ec2AFA9E0)
- [x] Verify on Polygonscan (source code published)
- [x] Document contract address in DEPLOYMENT_RECORD.md

Priority:

HIGH

Status:

COMPLETED

Dependencies:

Phase 2, Phase 3

---

## DT-05

Task:

Gas optimization analysis

Reason:

Scope.md lists gas analysis as a required deliverable.

Tasks:

- [x] Measure gas cost for registerConsent() — 74,649 gas (testnet)
- [x] Measure gas cost for revokeConsent() — 36,703 gas (testnet)
- [x] Measure gas cost for verifyAccess() with proof — 363,197 gas (testnet)
- [x] Measure gas cost for verifyAccess() revoked (early exit) — ~33,870 gas (local)
- [x] Document gas usage in PROJECT_SUMMARY.md and VALIDATION_REPORT.md
- [x] Optimization: custom errors instead of string reverts
- [x] Optimization: CEI pattern minimizes storage writes
- [x] Optimization: early-exit pattern for revoked consents (~330k gas saved)

Priority:

MEDIUM

Status:

COMPLETED

Dependencies:

Phase 3

---

## DT-06

Task:

Define proof freshness mechanism

Reason:

Security.md Threat Actor 4 mentions proof freshness but no mechanism is specified.

Tasks:

- [x] Design nonce or timestamp mechanism (off-chain application-layer approach)
- [x] Implement in frontend (ProofOutput.generatedAt timestamp)
- [x] Implement freshness validation in service provider (proof-freshness.ts)
- [x] Test replay attack prevention (existing nullifier mechanism)

Priority:

HIGH

Status:

COMPLETED (off-chain application-layer, no on-chain changes required)

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
- [x] Implement in circuit
- [x] Test uniqueness across services

Priority:

CRITICAL

Status:

COMPLETED (implemented in Phase 2)

Dependencies:

Phase 2

---

## DT-08

Task:

Identity Export and Backup

Reason:

Users need ability to export and backup their cryptographic identity (userSecret, consentVersion) for recovery purposes. Loss of identity means loss of consent ownership.

Tasks:

- [x] Implement identity export as encrypted JSON
- [x] Implement identity import from backup
- [x] Add passphrase-based encryption for export
- [x] Test round-trip export/import (scripts/test-export-import.mjs — 24/24 tests pass)

Priority:

HIGH

Status:

COMPLETED

Dependencies:

Phase 4

---

## DT-09

Task:

Deployment Preparation Documentation

Reason:

Project requires deployment guides for Polygon Amoy testnet and Vercel frontend deployment.

Tasks:

- [x] Create DEPLOYMENT.md (comprehensive deployment guide)
- [x] Create TESTNET_DEPLOYMENT.md (step-by-step manual guide)
- [x] Verify deployment scripts (deploy-consent-registry.ts)
- [x] Verify environment variables (.env.example)
- [x] Generate SHA-256 hashes for circuit files
- [x] Implement FER-08 (circuit file integrity verification)

Priority:

HIGH

Status:

COMPLETED

Dependencies:

Phase 5

---

## DT-10

Task:

Circuit File Integrity Verification (FER-08)

Reason:

Security.md requires circuit files to be integrity-verified before proof generation to prevent tampering.

Tasks:

- [x] Generate SHA-256 hashes for consent.wasm and consent_final.zkey
- [x] Implement circuit-integrity.ts with Web Crypto API
- [x] Integrity check integrated into generateProof() in proof.ts
- [x] Update Security.md with FER-08 implementation status
- [x] Update Architecture.md with integrity verification details

Priority:

HIGH

Status:

COMPLETED

Dependencies:

Phase 4, Phase 5

---

## DT-11

Task:

Migrate Polygon Amoy RPC endpoints (official RPC retirement)

Reason:

Polygon Labs retired the free official Amoy RPC endpoint `rpc-amoy.polygon.technology` (announced 2026-07-14, taken offline 2026-07-17). The Amoy testnet (Chain ID 80002) remains operational but requires community endpoints. Verified live endpoints: `https://polygon-amoy.drpc.org` (primary) and `https://polygon-amoy-bor-rpc.publicnode.com` (fallback).

Tasks:

- [x] Replace dead RPC in contracts/hardhat.config.ts default + fallback
- [x] Replace dead RPC in root .env and .env.example
- [x] Replace dead RPC in apps/user-vault and apps/service-provider .env.local and .env.example
- [x] Add wagmi `fallback()` transport (drpc primary + publicnode fallback) in both apps
- [x] Override viem polygonAmoy chain rpcUrls in both apps (polygonAmoyLive) so all consumers use live endpoints
- [x] Update docs: DEPLOYMENT.md, TESTNET_DEPLOYMENT.md, DEPLOYMENT_RECORD.md, VALIDATION_REPORT.md, RELEASE_REPORT.md
- [x] Verify deployed contracts reachable via new RPC (getConsentState, isConsentActive, verifier — PASS, block 44,600,256)
- [x] Rebuild both frontends (PASS) and re-run 43/43 contract tests (PASS)

Priority:

CRITICAL (deployment-blocking)

Status:

COMPLETED

Dependencies:

Phase 9 (deployed contracts remain valid; only RPC endpoints changed)

---

## DT-13

Task:

Migrate ESLint to ESLint 9 flat config (Next 14 `next lint` incompatibility)

Reason:

Next.js 14's `next lint` invokes removed ESLint 9 options (`useEslintrc`, `extensions`), producing `⨯ ESLint: Invalid Options` during every build. Additionally, `eslint-config-next@14.2.x` only supports legacy eslintrc format and ESLint ≤ 8, and was not even installed — the app-level `.eslintrc.json` files were non-functional.

Tasks:

- [x] Add `eslint.ignoreDuringBuilds: true` to both next.config.js files (lint runs via flat config `eslint .` instead of the incompatible `next lint`; type checking during build is unaffected)
- [x] Remove legacy `.eslintrc.json` from apps/user-vault and apps/service-provider
- [x] Rewrite root eslint.config.mjs: global ignores for generated dirs (.next, typechain-types, artifacts, circuits build/proofs), Node globals for scripts/configs, Mocha globals + CommonJS for circuit tests, `caughtErrorsIgnorePattern` for no-unused-vars
- [x] Replace `next lint` scripts with `eslint .` (root + both apps); remove `--ext` (removed in ESLint 9)
- [x] Fix unused catch params in scripts/test-export-import.mjs (24/24 tests still pass)
- [x] Validate: `npm run lint` 0 errors (3 pre-existing no-console warnings), both apps build without the ESLint warning

Priority:

MEDIUM

Status:

COMPLETED

Dependencies:

Phase 12 (Docker builds invoke `npm run build` — no lint step required)

Note:

- `next/core-web-vitals` rules (React hooks, Next route/link, jsx-a11y) are intentionally NOT carried over — eslint-config-next@14.2.x is legacy-format only and peer-incompatible with ESLint 9 (installing it would break `npm ci` with ERESOLVE). If React-specific checks are wanted later, add `eslint-plugin-react-hooks@^5` (flat-config native) to the root config.
- Lint enforcement now lives in the pre-commit hook (lint-staged) and `npm run lint` — `npm run lint` should be added to any future CI pipeline since builds no longer lint.

---

## DT-14

Task:

Make the circuit test suite runnable (mocha + chai setup)

Reason:

The circuits workspace had no `test` script and no documented way to run `circuits/test/consent-circuit.test.js`. Running mocha directly hung indefinitely because snarkjs/circomlibjs leave WASM handles open after tests finish (mocha does not exit); additionally chai's `expect` was not registered as a global.

Tasks:

- [x] Add circuits/package.json `test` script: `mocha --exit --require ./test/mocha-setup.js test/*.test.js` (`--exit` forces process termination despite open WASM handles)
- [x] Add circuits/test/mocha-setup.js (registers `global.expect` from chai)
- [x] Add mocha/chai to circuits devDependencies (already hoisted; lockfile re-linked)
- [x] Verify 6/6 circuit tests pass (~730ms) and lint stays clean (0 errors)

Priority:

MEDIUM

Status:

COMPLETED

Dependencies:

Phase 2 (test file existed; runner was missing)

---

## DT-15

Task:

Solidity test coverage to 100% (hardhat coverage)

Reason:

First `hardhat coverage` run showed 94.44% branch coverage — the constructor zero-address revert path (`if (address(_verifier) == address(0)) revert InvalidVerifier();`) had no test.

Tasks:

- [x] Run `npx hardhat coverage` (baseline: 100% stmts / 94.44% branch / 100% funcs / 100% lines)
- [x] Identify uncovered branch: ConsentRegistry constructor `InvalidVerifier` revert
- [x] Add constructor zero-address test (contracts/test/ConsentRegistry.test.ts) — 43 → 44 tests
- [x] Re-run coverage: **100% statements / 100% branch / 100% functions / 100% lines** for both contracts
- [x] Update test counts in README.md, PROJECT_SUMMARY.md, RECRUITER_GUIDE.md, VALIDATION_REPORT.md, Task.md

Priority:

MEDIUM

Status:

COMPLETED

Dependencies:

Phase 1

---

## DT-16

Task:

Integrate and document the Caddy deployment variant

Reason:

deploy/vps/docker-compose.caddy.yml was created for servers where ports 80/443 are already owned by an existing Caddy reverse proxy (e.g. an n8n stack), but it was never committed or documented. Required by the Documentation Synchronization Rule.

Tasks:

- [x] Add RTBF_CADDY_NETWORK to deploy/vps/.env.example (Caddy variant only)
- [x] Document Caddy variant in deploy/vps/README.md (section 10)
- [x] Document Caddy variant in docs/VPS_DEPLOYMENT.md
- [x] Validate both compose files parse (prettier YAML parse; docker compose unavailable on dev machine)

Priority:

LOW

Status:

COMPLETED

Dependencies:

Phase 12

---

## DT-17

Task:

Add host-Caddy deployment variant (docker-compose.caddy-host.yml)

Reason:

docker-compose.caddy.yml targets a Dockerized Caddy sharing a Docker network. The production VPS (gipsy, 43.163.106.178) runs Caddy as a host systemd service — containers must publish localhost-only ports instead. Required for the VPS deployment.

Tasks:

- [x] Create deploy/vps/docker-compose.caddy-host.yml (publish 127.0.0.1:3001/3002)
- [x] Document host-Caddy variant in deploy/vps/README.md (section 10)
- [x] Document host-Caddy variant in docs/VPS_DEPLOYMENT.md
- [x] Validate YAML parses (prettier)

Priority:

LOW

Status:

COMPLETED

Dependencies:

DT-16

---

## DT-18

Task:

Fix Docker build: copy nested app node_modules in builder stage

Reason:

connectkit and @types/node resolve nested under apps/\*/node_modules (not hoisted) in package-lock.json. The Dockerfile builder stages only copied the root node_modules, causing "Module not found: Can't resolve 'connectkit'" on the first real image build on the VPS. Phase 12 had only verified local builds and compose structure, never an actual image build.

Tasks:

- [x] Add COPY --from=deps /repo/apps ./apps to both Dockerfiles
- [x] Rebuild user-vault + service-provider images successfully on VPS

Priority:

HIGH (deployment-blocking)

Status:

COMPLETED

Dependencies:

DT-17 (deployment to VPS)

---

## DT-19

Task:

Fix root `npm run typecheck` so it passes across all workspaces

Reason:

Root `npm run typecheck` (`tsc --noEmit` with the root tsconfig) produced 558 errors — every `.tsx` file failed with TS17004 (no `jsx` flag) and every `@/*` alias import failed with TS2307 (no `paths` in the root config). The two Next.js apps were never actually type-checked by this script (they were only checked via their builds); the script was effectively broken. Running `tsc -p contracts` separately also surfaced 7 errors because `contracts/tsconfig.json` did not include `typechain-types`, so the hardhat-ethers module augmentation (`hardhat.d.ts` typing `getContractFactory`) was never loaded.

Tasks:

- [x] Fix tuple typing in contracts/test/ConsentCircuit.test.ts (ProofInput interface using BigNumberish, matching typechain Groth16Verifier.verifyProof signature)
- [x] Add ./typechain-types to contracts/tsconfig.json include (loads hardhat.d.ts augmentation)
- [x] Rewrite root typecheck script to per-workspace: tsc --noEmit -p apps/user-vault && tsc --noEmit -p apps/service-provider && tsc --noEmit -p contracts
- [x] Validate: npm run typecheck passes (exit 0), 44/44 contract tests still pass

Priority:

LOW (tooling / quality gate; no runtime impact)

Status:

COMPLETED

Dependencies:

Phase 12

---

# Completion Checklist

The project is complete when:

- [x] Consent registration works (on-chain validated: TX 0xd5ef218a...)
- [x] Proof generation works (Groth16 proof generated via snarkjs)
- [x] Proof verification works (on-chain validated: TX 0xe1805db1..., gas 363,197)
- [x] Revocation works (on-chain validated: TX 0x13a54aa1..., state=REVOKED)
- [x] Revocation is irreversible (ConsentAlreadyExists blocks re-registration)
- [x] Service provider access control works (build PASS, contract integration verified)
- [x] Security review completed (Phase 7 hardening, 44/44 tests pass)
- [x] Documentation completed (16 docs, Mermaid diagrams, PROJECT_SUMMARY)
- [x] Proof freshness validation (off-chain, application-layer, 5-minute window)
- [x] Identity export/import tested (24/24 round-trip tests pass)
- [ ] Demo video completed (DEMO_SCRIPT.md ready, video not recorded)
- [x] User approval obtained (Phase 8-10 all approved and executed)
- [x] VPS deployment stack prepared (Docker Compose, standalone builds verified)
- [x] Caddy integration variant documented (deploy/vps/docker-compose.caddy.yml)

Project Status:

FUNCTIONALLY COMPLETE — Demo video pending, VPS deployment ready
