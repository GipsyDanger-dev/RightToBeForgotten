'use client';

// FER-08: Circuit file integrity verification
// Known-good SHA-256 hashes for circuit artifacts
// Generated from circuits/build/ on 2026-06-06

const EXPECTED_HASHES: Record<string, string> = {
  '/circuits/consent.wasm': '88c57c466c4214d501bb4d452250a1bfef58a9d74d7fd596345e04a8fc7855b7',
  '/circuits/consent_final.zkey':
    '24acca388172cf60e2451debf570e90107a6e5b0bf33c41abbd706b20b680f1e',
};

async function computeSha256(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface IntegrityResult {
  valid: boolean;
  errors: string[];
}

export async function verifyCircuitIntegrity(): Promise<IntegrityResult> {
  const errors: string[] = [];

  for (const [path, expectedHash] of Object.entries(EXPECTED_HASHES)) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        errors.push(`Failed to fetch ${path}: ${response.status}`);
        continue;
      }
      const buffer = await response.arrayBuffer();
      const actualHash = await computeSha256(buffer);
      if (actualHash !== expectedHash) {
        errors.push(`Hash mismatch for ${path}`);
      }
    } catch (err) {
      errors.push(`Error verifying ${path}: ${(err as Error).message}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
