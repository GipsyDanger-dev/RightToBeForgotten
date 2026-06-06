'use client';

import { Identity } from './identity';
import { verifyCircuitIntegrity } from './circuit-integrity';

// Types matching the circuit interface
export interface ProofInput {
  userSecret: string;
  spId: string;
  consentVersion: string;
  consentId: string;
  nullifier: string;
}

export interface ProofOutput {
  proof: {
    a: [string, string];
    b: [[string, string], [string, string]];
    c: [string, string];
  };
  publicSignals: [string, string]; // [consentId, nullifier]
}

// Poseidon hash computed in a Web Worker
export async function computeConsentId(
  userSecret: string,
  spId: string,
  consentVersion: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./poseidon-worker.ts', import.meta.url));
    worker.onmessage = (e: MessageEvent) => {
      worker.terminate();
      if (e.data.error) {
        reject(new Error(e.data.error));
      } else {
        resolve(e.data.result);
      }
    };
    worker.onerror = (e) => {
      worker.terminate();
      reject(e.error);
    };
    worker.postMessage({
      type: 'poseidon3',
      inputs: [userSecret, spId, consentVersion.toString()],
    });
  });
}

export async function computeNullifier(
  userSecret: string,
  consentId: string,
  spId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./poseidon-worker.ts', import.meta.url));
    worker.onmessage = (e: MessageEvent) => {
      worker.terminate();
      if (e.data.error) {
        reject(new Error(e.data.error));
      } else {
        resolve(e.data.result);
      }
    };
    worker.onerror = (e) => {
      worker.terminate();
      reject(e.error);
    };
    worker.postMessage({
      type: 'poseidon3',
      inputs: [userSecret, consentId, spId],
    });
  });
}

export async function generateProof(identity: Identity, spId: string): Promise<ProofOutput> {
  // FER-08: Verify circuit file integrity before proof generation
  const integrity = await verifyCircuitIntegrity();
  if (!integrity.valid) {
    throw new Error(`Circuit file integrity check failed: ${integrity.errors.join(', ')}`);
  }

  // Compute consentId: poseidon(userSecret, spId, consentVersion)
  const consentId = await computeConsentId(identity.userSecret, spId, identity.consentVersion);

  // Compute nullifier: poseidon(userSecret, consentId, spId)
  const nullifier = await computeNullifier(identity.userSecret, consentId, spId);

  // Generate ZK proof in Web Worker
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./snarkjs-worker.ts', import.meta.url));
    worker.onmessage = (e: MessageEvent) => {
      worker.terminate();
      if (e.data.error) {
        reject(new Error(e.data.error));
      } else {
        resolve(e.data);
      }
    };
    worker.onerror = (e) => {
      worker.terminate();
      reject(e.error);
    };
    worker.postMessage({
      inputs: {
        userSecret: identity.userSecret,
        spId: spId,
        consentVersion: identity.consentVersion.toString(),
        consentId: consentId,
        nullifier: nullifier,
      },
    });
  });
}

// Utility: convert address to uint256 for circuit input
export function addressToUint256(address: string): string {
  if (!address.startsWith('0x')) {
    throw new Error('Invalid address: must start with 0x');
  }
  return BigInt(address).toString();
}

// Utility: format consentId for contract call
export function formatConsentId(consentId: string): string {
  if (consentId.startsWith('0x')) return consentId;
  return '0x' + BigInt(consentId).toString(16).padStart(64, '0');
}

// Utility: format nullifier for contract call
export function formatNullifier(nullifier: string): string {
  if (nullifier.startsWith('0x')) return nullifier;
  return '0x' + BigInt(nullifier).toString(16).padStart(64, '0');
}
