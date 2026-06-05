// Web Worker for Poseidon hashing
// Runs circomlibjs Poseidon in a separate thread to avoid blocking UI

import { buildPoseidon } from 'circomlibjs';

self.onmessage = async (e: MessageEvent) => {
  try {
    const { type, inputs } = e.data;
    const poseidon = await buildPoseidon();
    const F = poseidon.F;

    if (type === 'poseidon3') {
      // inputs: [val1, val2, val3] as string (bigint decimal or hex)
      const bigIntInputs = inputs.map((s: string) => {
        if (s.startsWith('0x')) return BigInt(s);
        return BigInt(s);
      });
      const hash = poseidon(bigIntInputs);
      const result = '0x' + F.toString(hash).toString(16).padStart(64, '0');
      self.postMessage({ result });
    } else {
      self.postMessage({ error: `Unknown type: ${type}` });
    }
  } catch (err) {
    self.postMessage({ error: (err as Error).message });
  }
};
