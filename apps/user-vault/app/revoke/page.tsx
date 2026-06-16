'use client';

import { useEffect, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import {
  devAutoUnlock,
  isDevMode,
  getAllConsents,
  ConsentRecord,
  updateConsentState,
} from '@/lib/identity';
import { formatConsentId } from '@/lib/proof';
import { CONSENT_REGISTRY_ADDRESS, CONSENT_REGISTRY_ABI } from '@/lib/contracts';
import { ConnectWallet } from '@/components/ConnectWallet';

export default function RevokePage() {
  const { isConnected } = useAccount();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [selectedConsent, setSelectedConsent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isDevMode()) {
      devAutoUnlock().then(() => loadConsents());
    } else {
      loadConsents();
    }
  }, []);

  async function loadConsents() {
    try {
      const all = await getAllConsents();
      setConsents(all.filter((c) => c.state === 'active'));
    } catch (err) {
      setConsents([]);
      setError((err as Error).message || 'Failed to load consents.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke() {
    setError('');
    if (!selectedConsent) {
      setError('Select a consent to revoke.');
      return;
    }

    if (!confirmed) {
      setError('You must confirm that you understand this action is irreversible.');
      return;
    }

    try {
      writeContract({
        address: CONSENT_REGISTRY_ADDRESS as `0x${string}`,
        abi: CONSENT_REGISTRY_ABI,
        functionName: 'revokeConsent',
        args: [selectedConsent as `0x${string}`],
      });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    if (isSuccess && selectedConsent) {
      updateConsentState(selectedConsent, 'revoked');
    }
  }, [isSuccess, selectedConsent]);

  if (!isConnected) {
    return (
      <div className="wallet-gate">
        <p className="wallet-gate-eyebrow">Wallet Required</p>
        <h1 className="wallet-gate-heading">Connect your wallet to continue</h1>
        <p className="wallet-gate-desc">You need a connected wallet to revoke consent.</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">Revoke Consent</p>
        <h1 className="hero-title">
          Forget
          <br />
          <span className="muted">me.</span>
        </h1>
        <div className="hero-body">
          <p className="hero-desc">
            This action is permanent and cannot be undone. Once revoked, the service provider will
            permanently lose the ability to verify this consent. Choose carefully.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="content-section">
        {loading ? (
          <p className="loading-text">Loading active consents...</p>
        ) : consents.length === 0 ? (
          <div className="empty-state">
            <p>No active consents to revoke.</p>
          </div>
        ) : (
          <>
            {/* Selectable Consent Rows */}
            <div className="form-group">
              <label className="rtf-label">Select Consent</label>
              {consents.map((c) => (
                <div
                  key={c.consentId}
                  className={`selectable-row ${
                    selectedConsent === c.consentId ? 'selectable-row--selected' : ''
                  }`}
                  onClick={() => setSelectedConsent(c.consentId)}
                >
                  <div style={{ flex: 1 }}>
                    <div className="key-row" style={{ border: 'none', padding: '2px 0' }}>
                      <span className="key-label">Consent ID</span>
                      <span className="key-value">{formatConsentId(c.consentId)}</span>
                    </div>
                    <div className="key-row" style={{ border: 'none', padding: '2px 0' }}>
                      <span className="key-label">Provider</span>
                      <span className="key-value">{c.spId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning Strip */}
            <p className="warning-strip">This action is permanent and cannot be undone.</p>

            {/* Confirmation Checkbox */}
            <div className="confirm-row" style={{ marginBottom: 'var(--gap-24)' }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="rtf-checkbox"
                id="revoke-confirm"
              />
              <label htmlFor="revoke-confirm" className="rtf-checkbox-label">
                I understand this action is permanent and irreversible. The service provider will
                permanently lose the ability to verify this consent.
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleRevoke}
              disabled={!selectedConsent || !confirmed || isConfirming || !!txHash}
              className="btn-destructive btn-destructive--full"
            >
              {isConfirming ? 'Confirming...' : txHash ? 'Submitted' : 'Forget Me'}
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

            {/* Success */}
            {isSuccess && (
              <div className="state-success">
                <div className="state-success-row">
                  <span className="state-success-dot"></span>
                  <span className="state-success-text">Consent revoked permanently</span>
                </div>
                <p className="state-success-detail">tx: {txHash}</p>
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
