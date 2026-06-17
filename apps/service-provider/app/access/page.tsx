'use client';

import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONSENT_REGISTRY_ADDRESS, CONSENT_REGISTRY_ABI } from '@/lib/contracts';

export default function AccessPage() {
  const [verified, setVerified] = useState(false);
  const [consentId, setConsentId] = useState<string | null>(null);

  useEffect(() => {
    const result = sessionStorage.getItem('verificationResult');
    const stored = sessionStorage.getItem('proofData');
    if (result === 'true' && stored) {
      try {
        const data = JSON.parse(stored);
        setConsentId(data.consentId);
        setVerified(true);
      } catch {
        setVerified(false);
      }
    } else {
      setVerified(false);
    }
  }, []);

  // On-chain re-verification: check consent is still active
  const { data: isActive, isLoading: checkingOnChain } = useReadContract({
    address: CONSENT_REGISTRY_ADDRESS as `0x${string}`,
    abi: CONSENT_REGISTRY_ABI,
    functionName: 'isConsentActive',
    args: consentId ? [consentId as `0x${string}`] : undefined,
    query: {
      enabled: verified && !!consentId,
    },
  });

  // Final access decision: sessionStorage verified AND on-chain active
  const accessGranted = verified && isActive === true;

  if (!verified) {
    return (
      <div className="wallet-gate">
        <p className="wallet-gate-eyebrow">Verification Required</p>
        <h1 className="wallet-gate-heading">You must verify your authorization first</h1>
        <p className="wallet-gate-desc">
          This content is only accessible after a successful Zero-Knowledge Proof verification.
        </p>
        <a href="/verify" className="btn-primary">
          Go to Verification
        </a>
      </div>
    );
  }

  // On-chain check in progress
  if (checkingOnChain) {
    return (
      <div className="wallet-gate">
        <p className="wallet-gate-eyebrow">Verifying</p>
        <h1 className="wallet-gate-heading">Checking consent on-chain...</h1>
        <p className="wallet-gate-desc">
          Re-verifying consent status with the ConsentRegistry smart contract.
        </p>
      </div>
    );
  }

  // On-chain check failed — consent revoked or not active
  if (!accessGranted) {
    return (
      <div className="wallet-gate">
        <p className="wallet-gate-eyebrow">Access Denied</p>
        <h1 className="wallet-gate-heading">Consent is no longer active</h1>
        <p className="wallet-gate-desc">
          The consent associated with this proof has been revoked or is no longer valid on-chain.
        </p>
        <a href="/verify" className="btn-primary">
          Go to Verification
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">Protected Content</p>
        <h1 className="hero-title">
          Access
          <br />
          <span className="muted">granted.</span>
        </h1>
        <div className="hero-body">
          <p className="hero-desc">
            Your authorization has been verified via Zero-Knowledge Proof. Your identity remains
            private — only consent validity was confirmed on-chain.
          </p>
        </div>
      </section>

      {/* Privacy Guarantees */}
      <section className="section">
        <div className="section-header">
          <span className="section-label">Privacy Guarantees</span>
        </div>

        <div className="consent-item">
          <div className="consent-header">
            <div>
              <p className="consent-title">Zero-Knowledge Verification</p>
              <p className="consent-desc">
                This content is only accessible to users with valid, active consent. The
                verification was performed using a Zero-Knowledge Proof.
              </p>
            </div>
            <div className="consent-meta">
              <span className="status-badge status-badge--green">
                <span className="status-dot status-dot--green"></span>
                verified
              </span>
            </div>
          </div>
          <div style={{ marginTop: 'var(--gap-12)' }}>
            <div className="key-row">
              <span className="key-label">Identity</span>
              <span className="key-value">userSecret was never revealed</span>
            </div>
            <div className="key-row">
              <span className="key-label">Consent</span>
              <span className="key-value">Only validity was confirmed</span>
            </div>
            <div className="key-row">
              <span className="key-label">Replay</span>
              <span className="key-value">Nullifier prevents proof reuse</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Demo Content */}
      <section className="section">
        <div className="section-header">
          <span className="section-label">Demo Content</span>
        </div>
        <p className="u-mono-xs" style={{ maxWidth: '480px' }}>
          This is a demonstration of privacy-preserving access control. In a real application, this
          page would contain sensitive data that only authorized users should see.
        </p>
      </section>

      {/* Logout */}
      <div className="content-section" style={{ paddingTop: 'var(--gap-24)' }}>
        <button
          onClick={() => {
            sessionStorage.removeItem('verificationResult');
            sessionStorage.removeItem('proofData');
            window.location.href = '/';
          }}
          className="btn-ghost"
        >
          End Session
        </button>
      </div>

      {/* Footer Stats */}
      <div className="footer-stats">
        <div className="fs-cell">
          <span className="fs-label">Status</span>
          <span className="fs-value fs-value--green">Verified</span>
        </div>
        <div className="fs-cell">
          <span className="fs-label">Method</span>
          <span className="fs-value">Groth16 ZKP</span>
        </div>
        <div className="fs-cell">
          <span className="fs-label">Network</span>
          <span className="fs-value">Polygon Amoy</span>
        </div>
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
