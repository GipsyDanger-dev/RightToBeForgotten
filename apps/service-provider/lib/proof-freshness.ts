// Proof freshness validation (off-chain, application-layer)
// No on-chain changes required.

export const PROOF_MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

export interface FreshnessResult {
  fresh: boolean;
  ageMs: number;
  ageDisplay: string;
}

export function checkProofFreshness(generatedAt: number | undefined): FreshnessResult {
  if (!generatedAt) {
    // Legacy proofs without timestamp — treat as stale
    return {
      fresh: false,
      ageMs: Infinity,
      ageDisplay: 'unknown (legacy proof)',
    };
  }

  const ageMs = Date.now() - generatedAt;
  const fresh = ageMs <= PROOF_MAX_AGE_MS;

  const ageSeconds = Math.floor(ageMs / 1000);
  const ageDisplay =
    ageSeconds < 60
      ? `${ageSeconds}s ago`
      : `${Math.floor(ageSeconds / 60)}m ${ageSeconds % 60}s ago`;

  return { fresh, ageMs, ageDisplay };
}
