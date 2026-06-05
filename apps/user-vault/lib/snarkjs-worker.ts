// Web Worker for SnarkJS proof generation
// Runs Groth16 proof generation in a separate thread to avoid blocking UI

import { groth16 } from 'snarkjs';

interface ProofInputs {
  userSecret: string;
  spId: string;
  consentVersion: string;
  consentId: string;
  nullifier: string;
}

self.onmessage = async (e: MessageEvent<{ inputs: ProofInputs }>) => {
  try {
    const { inputs } = e.data;

    const wasmPath = '/circuits/consent.wasm';
    const zkeyPath = '/circuits/consent_final.zkey';

    const { proof, publicSignals } = await groth16.fullProve(inputs, wasmPath, zkeyPath);

    self.postMessage({
      proof: {
        a: proof.pi_a.slice(0, 2) as [string, string],
        b: [
          [proof.pi_b[0][1], proof.pi_b[0][0]] as [string, string],
          [proof.pi_b[1][1], proof.pi_b[1][0]] as [string, string],
        ],
        c: proof.pi_c.slice(0, 2) as [string, string],
      },
      publicSignals: publicSignals as [string, string],
    });
  } catch (err) {
    self.postMessage({ error: (err as Error).message });
  }
};
