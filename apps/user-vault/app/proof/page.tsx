'use client';

import { useEffect, useState } from 'react';
import {
  getAllConsents,
  loadIdentity,
  isDevMode,
  devAutoUnlock,
  ConsentRecord,
} from '@/lib/identity';
import { generateProof, formatConsentId } from '@/lib/proof';

export default function ProofPage() {
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [selectedSpId, setSelectedSpId] = useState('');
  const [manualSpId, setManualSpId] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [proofJson, setProofJson] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAllConsents()
      .then((all) => {
        const active = all.filter((c) => c.state === 'active');
        setConsents(active);
        if (active.length > 0) setSelectedSpId(active[0].spId);
      })
      .catch((err) => setError((err as Error).message || 'Failed to load consents.'))
      .finally(() => setLoading(false));
  }, []);

  function resolveSpId(): string {
    return manualSpId.trim() || selectedSpId;
  }

  async function handleGenerate() {
    setError('');
    setStatus('');
    setProofJson('');
    setCopied(false);

    const spId = resolveSpId();
    if (!spId.startsWith('0x') || spId.length !== 42) {
      setError('Invalid service provider address. Must be a valid Ethereum address.');
      return;
    }

    try {
      setStatus('Unlocking identity...');
      const identity = isDevMode() ? await devAutoUnlock() : await loadIdentity(passphrase);
      if (!identity) {
        setError('Could not load identity. Check your passphrase.');
        return;
      }

      setStatus('Generating Zero-Knowledge Proof...');
      setGenerating(true);
      const output = await generateProof(identity, spId.toLowerCase());

      // Map ProofOutput to the Service Provider ProofData format
      const proofData = {
        consentId: formatConsentId(output.publicSignals[0]),
        nullifier: formatConsentId(output.publicSignals[1]),
        proof: output.proof,
        generatedAt: output.generatedAt,
      };

      setProofJson(JSON.stringify(proofData, null, 2));
      setStatus('Proof generated locally — your secret never left this device.');
    } catch (err) {
      setError((err as Error).message);
      setStatus('');
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(proofJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError((err as Error).message || 'Failed to copy to clipboard.');
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">Generate Proof</p>
        <h1 className="hero-title">
          Prove
          <br />
          <span className="muted">without revealing.</span>
        </h1>
        <div className="hero-body">
          <p className="hero-desc">
            Generate a Zero-Knowledge Proof for an active consent. The proof runs entirely in your
            browser — the userSecret is never transmitted anywhere.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="content-section">
        <p className="u-mono-xs" style={{ marginBottom: 'var(--gap-24)' }}>
          Pick the service provider from your active consents, or paste a provider address.
        </p>

        {/* Consent Selector */}
        {loading ? (
          <p className="loading-text">Loading consents...</p>
        ) : (
          <>
            {consents.length > 0 && (
              <div className="form-group">
                <label className="rtf-label">Active Consents</label>
                {consents.map((c) => (
                  <div
                    key={c.consentId}
                    className={`selectable-row ${
                      selectedSpId === c.spId && !manualSpId ? 'selectable-row--selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedSpId(c.spId);
                      setManualSpId('');
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div className="key-row" style={{ border: 'none', padding: '2px 0' }}>
                        <span className="key-label">Provider</span>
                        <span className="key-value">{c.spId}</span>
                      </div>
                      <div className="key-row" style={{ border: 'none', padding: '2px 0' }}>
                        <span className="key-label">Consent ID</span>
                        <span className="key-value">{formatConsentId(c.consentId)}</span>
                      </div>
                      <div className="key-row" style={{ border: 'none', padding: '2px 0' }}>
                        <span className="key-label">Version</span>
                        <span className="key-value">{c.consentVersion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {consents.length === 0 && (
              <p className="u-mono-xs" style={{ marginBottom: 'var(--gap-16)' }}>
                No active consents found — paste a provider address below, or register consent
                first.
              </p>
            )}

            {/* Manual spId */}
            <div className="form-group">
              <label className="rtf-label">Service Provider Address (spId)</label>
              <input
                type="text"
                value={manualSpId || selectedSpId}
                onChange={(e) => setManualSpId(e.target.value)}
                placeholder="0x..."
                className="rtf-input"
              />
              <p className="form-hint">
                The proof is bound to this provider — use the same address registered on-chain.
              </p>
            </div>
          </>
        )}

        {/* Passphrase */}
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

        {/* Generate */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary btn-primary--full"
        >
          {generating ? 'Generating Proof...' : 'Generate Proof'}
        </button>

        {/* Status */}
        {status && !generating && (
          <div className="state-success" style={{ marginTop: 'var(--gap-24)' }}>
            <div className="state-success-row">
              <span className="state-success-dot"></span>
              <span className="state-success-text">{status}</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="state-error" style={{ marginTop: 'var(--gap-24)' }}>
            <span className="state-error-dot"></span>
            <span className="state-error-text">{error}</span>
          </div>
        )}

        {/* Proof Output */}
        {proofJson && (
          <div style={{ marginTop: 'var(--gap-24)' }}>
            <div className="form-group">
              <label className="rtf-label">Proof Data (JSON)</label>
              <textarea readOnly value={proofJson} className="rtf-textarea" rows={12} />
              <button
                onClick={handleCopy}
                className="btn-ghost"
                style={{ marginTop: 'var(--gap-8)' }}
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <p className="u-mono-xs" style={{ marginTop: 'var(--gap-8)' }}>
              Paste this JSON into the Service Provider login page to verify access.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="bottom-spacer"></div>
      <div className="bottom-bar">
        <div className="bb-left">
          <span className="bb-item">
            <span className="bb-dot"></span>polygon amoy
          </span>
        </div>
        <div className="bb-right">
          <span className="bb-item">v1.0.0</span>
        </div>
      </div>
    </>
  );
}
