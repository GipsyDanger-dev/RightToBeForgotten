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
      } catch (err) {
        setProofData(null);
        setError((err as Error).message || 'Failed to load proof data.');
      }
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
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
      <div className="wallet-gate">
        <p className="wallet-gate-eyebrow">Wallet Required</p>
        <h1 className="wallet-gate-heading">Connect your wallet to continue</h1>
        <p className="wallet-gate-desc">You need a connected wallet to verify access.</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">Verification</p>
        <h1 className="hero-title">
          Verify
          <br />
          <span className="muted">proof.</span>
        </h1>
        <div className="hero-body">
          <p className="hero-desc">
            Submit the user&apos;s Zero-Knowledge Proof to the ConsentRegistry smart contract. The
            proof verifies consent validity without revealing the user&apos;s identity.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="content-section">
        {!proofData ? (
          <div className="empty-state">
            <p>No proof data found.</p>
            <p style={{ marginTop: '0.5rem' }}>
              <a href="/">Go to Login →</a>
            </p>
          </div>
        ) : (
          <>
            {/* Proof Details */}
            <div className="consent-item">
              <div className="consent-header">
                <div>
                  <p className="consent-title">Proof Data</p>
                  <p className="consent-desc">ZK proof submitted for on-chain verification.</p>
                </div>
              </div>
              <div style={{ marginTop: 'var(--gap-12)' }}>
                <div className="key-row">
                  <span className="key-label">Consent ID</span>
                  <span className="key-value">{proofData.consentId}</span>
                </div>
                <div className="key-row">
                  <span className="key-label">Nullifier</span>
                  <span className="key-value">{proofData.nullifier}</span>
                </div>
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isConfirming || verificationResult !== null}
              className="btn-primary btn-primary--full"
              style={{ marginTop: 'var(--gap-24)' }}
            >
              {isConfirming
                ? 'Verifying...'
                : verificationResult !== null
                  ? 'Verified'
                  : 'Verify Access'}
            </button>

            {/* Pending */}
            {isConfirming && (
              <div className="tx-pending">
                <span className="tx-pending-dot"></span>
                <span className="tx-pending-text">Waiting for confirmation</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="state-error">
                <span className="state-error-dot"></span>
                <span className="state-error-text">{error}</span>
              </div>
            )}

            {/* Verified */}
            {verificationResult === true && (
              <div className="state-success">
                <div className="state-success-row">
                  <span className="state-success-dot"></span>
                  <span className="state-success-text">Access Verified</span>
                </div>
                <p className="state-success-detail">The proof is valid and consent is active.</p>
                <a
                  href="/access"
                  className="btn-primary"
                  style={{ display: 'inline-block', marginTop: 'var(--gap-16)' }}
                >
                  Access Protected Content
                </a>
              </div>
            )}

            {/* Denied */}
            {verificationResult === false && (
              <div className="state-error">
                <span className="state-error-dot"></span>
                <span className="state-error-text">
                  Access Denied — proof invalid or consent revoked
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="bottom-spacer"></div>
      <div className="bottom-bar">
        <div className="bb-left">
          <span className="bb-item">
            <span className="bb-dot"></span>connected
          </span>
        </div>
        <div className="bb-right">
          <span className="bb-item">polygon amoy</span>
          <div className="bb-sep"></div>
          <span className="bb-item">v1.0.0</span>
        </div>
      </div>
    </>
  );
}
