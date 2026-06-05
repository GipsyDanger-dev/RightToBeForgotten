'use client';

import { useEffect, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONSENT_REGISTRY_ADDRESS, CONSENT_REGISTRY_ABI } from '@/lib/contracts';
import { ConnectWallet } from '@/components/ConnectWallet';
import type { ProofData } from '@/app/page';

export default function VerifyPage() {
  const { isConnected } = useAccount();
  const [proofData, setProofData] = useState<ProofData | null>(null);
  const [error, setError] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('proofData');
    if (stored) {
      try {
        setProofData(JSON.parse(stored));
      } catch {
        setProofData(null);
      }
    }
  }, []);

  // Check verification result from receipt
  useEffect(() => {
    if (isSuccess) {
      // For PoC, transaction success means verification passed
      // In production, parse AccessVerified event from receipt.logs
      setVerificationResult(true);
      sessionStorage.setItem('verificationResult', 'true');
    }
  }, [isSuccess]);

  function handleVerify() {
    setError('');
    if (!proofData) {
      setError('No proof data found. Go to Login page first.');
      return;
    }

    try {
      // Convert proof data from strings to bigints for contract call
      const pA: [bigint, bigint] = [BigInt(proofData.proof.a[0]), BigInt(proofData.proof.a[1])];
      const pB: [[bigint, bigint], [bigint, bigint]] = [
        [BigInt(proofData.proof.b[0][0]), BigInt(proofData.proof.b[0][1])],
        [BigInt(proofData.proof.b[1][0]), BigInt(proofData.proof.b[1][1])],
      ];
      const pC: [bigint, bigint] = [BigInt(proofData.proof.c[0]), BigInt(proofData.proof.c[1])];

      writeContract({
        address: CONSENT_REGISTRY_ADDRESS as `0x${string}`,
        abi: CONSENT_REGISTRY_ABI,
        functionName: 'verifyAccess',
        args: [
          proofData.consentId as `0x${string}`,
          pA,
          pB,
          pC,
          proofData.nullifier as `0x${string}`,
        ],
      });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Access</h1>
        <p className="text-gray-500 mb-4">Connect your wallet to verify access.</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Verify Access</h1>
      <p className="text-sm text-gray-500 mb-6">
        Submit the user&apos;s proof to the ConsentRegistry to verify authorization.
      </p>

      {!proofData ? (
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg text-center">
          <p className="text-gray-500">No proof data found.</p>
          <a href="/" className="text-sm text-blue-600 dark:text-blue-400 underline">
            Go to Login
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-sm font-medium mb-2">Proof Data</h2>
            <div className="text-xs font-mono text-gray-500 space-y-1">
              <p>consentId: {proofData.consentId}</p>
              <p>nullifier: {proofData.nullifier}</p>
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={isConfirming || verificationResult !== null}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {isConfirming
              ? 'Verifying...'
              : verificationResult !== null
                ? 'Verified'
                : 'Verify Access'}
          </button>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          {verificationResult === true && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                Access Verified
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                The proof is valid and consent is active.
              </p>
              <a
                href="/access"
                className="mt-3 inline-block text-sm text-green-900 dark:text-green-100 underline"
              >
                Access Protected Content
              </a>
            </div>
          )}

          {verificationResult === false && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">Access Denied</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                The proof is invalid or consent has been revoked.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
