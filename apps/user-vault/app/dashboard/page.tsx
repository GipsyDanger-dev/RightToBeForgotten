'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getAllConsents, ConsentRecord, isDevMode, devAutoUnlock } from '@/lib/identity';
import { formatConsentId } from '@/lib/proof';
import { ConnectWallet } from '@/components/ConnectWallet';

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setConsents(all);
    } catch (err) {
      setConsents([]);
      setError((err as Error).message || 'Failed to load consents.');
    } finally {
      setLoading(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="wallet-gate">
        <p className="wallet-gate-eyebrow">Wallet Required</p>
        <h1 className="wallet-gate-heading">Connect your wallet to continue</h1>
        <p className="wallet-gate-desc">
          You need a connected wallet to view your consent dashboard.
        </p>
        <ConnectWallet />
      </div>
    );
  }

  const activeCount = consents.filter((c) => c.state === 'active').length;
  const revokedCount = consents.filter((c) => c.state === 'revoked').length;

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">Consent Dashboard</p>
        <h1 className="hero-title">
          Your consents.
          <br />
          <span className="muted">At a glance.</span>
        </h1>
        <div className="hero-body">
          <p className="hero-desc">
            Every service provider you&apos;ve authorized, their consent status, and verification
            history. Review who can access your data — and cut them off when you&apos;re done.
          </p>
          <div>
            <div className="hero-deco-num">{consents.length.toString().padStart(2, '0')}</div>
            <div className="hero-deco-label">consents</div>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="section">
          <div className="state-error">
            <span className="state-error-dot"></span>
            <span className="state-error-text">{error}</span>
          </div>
        </div>
      )}

      {/* Consent List */}
      <section className="section">
        <div className="section-header">
          <span className="section-label">All Consents</span>
          <span className="section-count">
            {activeCount} active · {revokedCount} revoked
          </span>
        </div>

        {loading ? (
          <p className="loading-text">Loading consents...</p>
        ) : consents.length === 0 ? (
          <div className="empty-state">
            <p>No consents registered yet.</p>
            <p style={{ marginTop: '0.5rem' }}>
              <Link href="/consent">Register your first consent →</Link>
            </p>
          </div>
        ) : (
          consents.map((c) => (
            <div key={c.consentId} className="consent-item">
              <div className="consent-header">
                <div>
                  <p className="consent-title">Consent</p>
                  <p className="consent-desc">
                    Registered {new Date(c.registeredAt).toLocaleDateString()} · Version{' '}
                    {c.consentVersion}
                  </p>
                </div>
                <div className="consent-meta">
                  <span
                    className={`status-badge ${
                      c.state === 'active' ? 'status-badge--green' : 'status-badge--red'
                    }`}
                  >
                    <span
                      className={`status-dot ${
                        c.state === 'active' ? 'status-dot--green' : 'status-dot--red'
                      }`}
                    ></span>
                    {c.state}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 'var(--gap-12)' }}>
                <div className="key-row">
                  <span className="key-label">Consent ID</span>
                  <span className="key-value">{formatConsentId(c.consentId)}</span>
                </div>
                <div className="key-row">
                  <span className="key-label">Provider</span>
                  <span className="key-value">{c.spId}</span>
                </div>
                <div className="key-row">
                  <span className="key-label">Registered</span>
                  <span className="key-value">{new Date(c.registeredAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Footer Stats */}
      <div className="footer-stats">
        <div className="fs-cell">
          <span className="fs-label">Active</span>
          <span className="fs-value fs-value--green">{activeCount} consents</span>
        </div>
        <div className="fs-cell">
          <span className="fs-label">Revoked</span>
          <span className="fs-value fs-value--red">{revokedCount}</span>
        </div>
        <div className="fs-cell">
          <span className="fs-label">Total</span>
          <span className="fs-value">{consents.length}</span>
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
