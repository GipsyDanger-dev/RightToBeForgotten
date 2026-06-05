declare module 'circomlibjs' {
  interface PoseidonField {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toString(...args: any[]): string;
  }

  interface PoseidonInstance {
    (inputs: (bigint | number)[]): bigint;
    F: PoseidonField;
  }

  export function buildPoseidon(): Promise<PoseidonInstance>;
}

declare module 'snarkjs' {
  export const groth16: {
    fullProve(
      input: Record<string, string>,
      wasmPath: string,
      zkeyPath: string
    ): Promise<{
      proof: {
        pi_a: string[];
        pi_b: string[][];
        pi_c: string[];
      };
      publicSignals: string[];
    }>;
  };
}
