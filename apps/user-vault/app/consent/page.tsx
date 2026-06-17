'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { devAutoUnlock, isDevMode, loadIdentity, saveConsent } from '@/lib/identity';
import { computeConsentId, formatConsentId } from '@/lib/proof';
import { CONSENT_REGISTRY_ADDRESS, CONSENT_REGISTRY_ABI } from '@/lib/contracts';
import { ConnectWallet } from '@/components/ConnectWallet';

export default function ConsentPage() {
  const { isConnected } = useAccount();
  const [spId, setSpId] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [status, setStatus] = useState('');
  const [consentId, setConsentId] = useState('');
  const [consentVersion, setConsentVersion] = useState(1);
  const [error, setError] = useState('');

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Save consent to IndexedDB ONLY after on-chain tx is confirmed
  useEffect(() => {
    if (isSuccess && consentId && spId) {
      saveConsent({
        consentId: formatConsentId(consentId),
        spId: spId.toLowerCase(),
        consentVersion,
        state: 'active',
        registeredAt: Date.now(),
      }).catch((err) => {
        console.error('Failed to save consent locally:', err);
      });
    }
  }, [isSuccess, consentId, spId, consentVersion]);

  async function handleRegister() {
    setError('');
    setStatus('');

    if (!spId || !spId.startsWith('0x') || spId.length !== 42) {
      setError('Invalid service provider address. Must be a valid Ethereum address.');
      return;
    }

    try {
      setStatus('Loading identity...');
      const identity = isDevMode() ? await devAutoUnlock() : await loadIdentity(passphrase);

      if (!identity) {
        setError('Could not load identity. Check your passphrase.');
        return;
      }

      setStatus('Computing consentId...');
      const cid = await computeConsentId(
        identity.userSecret,
        spId.toLowerCase(),
        identity.consentVersion
      );
      setConsentId(cid);
      setConsentVersion(identity.consentVersion);

      setStatus('Submitting transaction...');
      const formattedCid = formatConsentId(cid);

      writeContract({
        address: CONSENT_REGISTRY_ADDRESS as `0x${string}`,
        abi: CONSENT_REGISTRY_ABI,
        functionName: 'registerConsent',
        args: [formattedCid as `0x${string}`],
      });
    } catch (err) {
      setError((err as Error).message);
      setStatus('');
    }
  }

  if (!isConnected) {
    return (
      <div className="wallet-gate">
        <p className="wallet-gate-eyebrow">Wallet Required</p>
        <h1 className="wallet-gate-heading">Connect your wallet to continue</h1>
        <p className="wallet-gate-desc">You need a connected wallet to register consent.</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">Register Consent</p>
        <h1 className="hero-title">
          Authorize
          <br />
          <span className="muted">a provider.</span>
        </h1>
        <div className="hero-body">
          <p className="hero-desc">
            Register a new consent for a service provider. Your identity is protected by a
            Zero-Knowledge Proof — the provider can verify consent validity without ever seeing your
            secret.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="content-section">
        <div className="form-group">
          <label className="rtf-label">Service Provider Address (spId)</label>
          <input
            type="text"
            value={spId}
            onChange={(e) => setSpId(e.target.value)}
            placeholder="0x..."
            className="rtf-input"
          />
          <p className="form-hint">The Ethereum wallet address of the service provider.</p>
        </div>

        {!isDevMode() && (
          <div className="form-group">
            <label className="rtf-label">Passphrase</label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter your passphrase"
              className="rtf-input"
            />
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleRegister}
          disabled={isConfirming || !!txHash}
          className="btn-primary btn-primary--full"
        >
          {isConfirming ? 'Confirming...' : txHash ? 'Submitted' : 'Register Consent'}
        </button>

        {/* Pending */}
        {isConfirming && (
          <div className="tx-pending">
            <span className="tx-pending-dot"></span>
            <span className="tx-pending-text">Waiting for confirmation</span>
          </div>
        )}

        {/* Status */}
        {status && !isConfirming && (
          <div className="state-success">
            <div className="state-success-row">
              <span className="state-success-dot"></span>
              <span className="state-success-text">{status}</span>
            </div>
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
        {isSuccess && consentId && (
          <div className="state-success">
            <div className="state-success-row">
              <span className="state-success-dot"></span>
              <span className="state-success-text">Consent registered successfully</span>
            </div>
            <p className="state-success-detail">consentId: {formatConsentId(consentId)}</p>
            <p className="state-success-detail">tx: {txHash}</p>
          </div>
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
