'use client';

import { useEffect, useState } from 'react';
import {
  hasIdentity,
  generateIdentity,
  saveIdentity,
  loadIdentity,
  exportIdentity,
  importIdentity,
  devAutoUnlock,
  isDevMode,
  Identity,
} from '@/lib/identity';

type View = 'status' | 'create' | 'unlock' | 'export' | 'import';

const tabs: { key: View; label: string }[] = [
  { key: 'status', label: 'Status' },
  { key: 'create', label: 'Create' },
  { key: 'unlock', label: 'Unlock' },
  { key: 'export', label: 'Export' },
  { key: 'import', label: 'Import' },
];

export default function IdentityPage() {
  const [view, setView] = useState<View>('status');
  const [identityExists, setIdentityExists] = useState<boolean | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [exportData, setExportData] = useState('');
  const [importData, setImportData] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    hasIdentity().then((exists) => {
      setIdentityExists(exists);
      if (!exists && isDevMode()) {
        devAutoUnlock().then((id) => {
          setIdentity(id);
          setIdentityExists(true);
        });
      }
    });
  }, []);

  async function handleCreate() {
    setError('');
    if (passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters.');
      return;
    }
    if (passphrase !== confirmPassphrase) {
      setError('Passphrases do not match.');
      return;
    }

    try {
      const id = generateIdentity();
      await saveIdentity(id, passphrase);
      setIdentity(id);
      setIdentityExists(true);
      setView('status');
      setStatus('Identity created successfully.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleUnlock() {
    setError('');
    try {
      const id = await loadIdentity(passphrase);
      if (!id) {
        setError('Invalid passphrase or no identity found.');
        return;
      }
      setIdentity(id);
      setView('status');
      setStatus('Identity unlocked.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleExport() {
    setError('');
    try {
      const data = await exportIdentity();
      if (!data) {
        setError('No identity found or invalid passphrase.');
        return;
      }
      setExportData(data);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleImport() {
    setError('');
    if (passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters.');
      return;
    }

    // Confirm before overwriting existing identity
    if (identityExists) {
      const confirmed = window.confirm(
        'You already have an identity. Importing will OVERWRITE it permanently. Continue?'
      );
      if (!confirmed) return;
    }

    try {
      const id = await importIdentity(importData, passphrase);
      if (!id) {
        setError('Invalid backup data or passphrase.');
        return;
      }
      setIdentity(id);
      setIdentityExists(true);
      setView('status');
      setStatus('Identity imported successfully.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function resetFormState() {
    setPassphrase('');
    setConfirmPassphrase('');
    setExportData('');
    setImportData('');
    setError('');
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">Identity Management</p>
        <h1 className="hero-title">
          Your
          <br />
          <span className="muted">identity.</span>
        </h1>
        <div className="hero-body">
          <p className="hero-desc">
            Create, unlock, export, or import your cryptographic identity. Your identity is
            encrypted locally and never leaves your device.
          </p>
        </div>
      </section>

      {/* Tab Bar */}
      <div className="content-section">
        <div className="tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setView(tab.key);
                resetFormState();
              }}
              className={`tab-item${view === tab.key ? ' tab-item--active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Message */}
        {status && (
          <div className="state-success" style={{ marginBottom: 'var(--gap-24)' }}>
            <div className="state-success-row">
              <span className="state-success-dot"></span>
              <span className="state-success-text">{status}</span>
            </div>
          </div>
        )}

        {/* STATUS View */}
        {view === 'status' && (
          <div>
            <div className="consent-item">
              <div className="consent-header">
                <div>
                  <p className="consent-title">Identity Status</p>
                  <p className="consent-desc">
                    {identityExists === null
                      ? 'Checking...'
                      : identityExists
                        ? 'Your cryptographic identity is loaded and ready.'
                        : 'No identity found. Create one or import a backup.'}
                  </p>
                </div>
                <div className="consent-meta">
                  {identityExists !== null && (
                    <span
                      className={`status-badge ${
                        identityExists ? 'status-badge--green' : 'status-badge--yellow'
                      }`}
                    >
                      <span
                        className={`status-dot ${
                          identityExists ? 'status-dot--green' : 'status-dot--yellow'
                        }`}
                      ></span>
                      {identityExists ? 'active' : 'missing'}
                    </span>
                  )}
                </div>
              </div>

              {identity && (
                <div style={{ marginTop: 'var(--gap-12)' }}>
                  <div className="key-row">
                    <span className="key-label">User Secret</span>
                    <span className="key-value">
                      {identity.userSecret.slice(0, 10)}...{identity.userSecret.slice(-8)}
                    </span>
                  </div>
                  <div className="key-row">
                    <span className="key-label">Version</span>
                    <span className="key-value">{identity.consentVersion}</span>
                  </div>
                </div>
              )}

              {isDevMode() && (
                <div style={{ marginTop: 'var(--gap-12)' }}>
                  <span className="status-badge status-badge--yellow">
                    <span className="status-dot status-dot--yellow"></span>
                    dev mode · auto-unlock
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="btn-row" style={{ marginTop: 'var(--gap-24)' }}>
              {!identityExists && (
                <button onClick={() => setView('create')} className="btn-primary">
                  Create Identity
                </button>
              )}
              {identityExists && !identity && (
                <button onClick={() => setView('unlock')} className="btn-primary">
                  Unlock
                </button>
              )}
              {identityExists && (
                <button onClick={() => setView('export')} className="btn-ghost">
                  Export Backup
                </button>
              )}
              <button onClick={() => setView('import')} className="btn-ghost">
                Import Backup
              </button>
            </div>
          </div>
        )}

        {/* CREATE View */}
        {view === 'create' && (
          <div>
            <p className="u-mono-xs" style={{ marginBottom: 'var(--gap-24)' }}>
              Create a new cryptographic identity. This will generate a random 256-bit userSecret.
            </p>
            <div className="form-group">
              <label className="rtf-label">Passphrase</label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Min 8 characters"
                className="rtf-input"
              />
            </div>
            <div className="form-group">
              <label className="rtf-label">Confirm Passphrase</label>
              <input
                type="password"
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                placeholder="Repeat passphrase"
                className="rtf-input"
              />
            </div>
            <div className="btn-row">
              <button onClick={handleCreate} className="btn-primary" style={{ flex: 1 }}>
                Create
              </button>
              <button
                onClick={() => {
                  setView('status');
                  resetFormState();
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* UNLOCK View */}
        {view === 'unlock' && (
          <div>
            <p className="u-mono-xs" style={{ marginBottom: 'var(--gap-24)' }}>
              Enter your passphrase to decrypt and unlock your identity.
            </p>
            <div className="form-group">
              <label className="rtf-label">Passphrase</label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="rtf-input"
              />
            </div>
            <div className="btn-row">
              <button onClick={handleUnlock} className="btn-primary" style={{ flex: 1 }}>
                Unlock
              </button>
              <button
                onClick={() => {
                  setView('status');
                  resetFormState();
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* EXPORT View */}
        {view === 'export' && (
          <div>
            <p className="u-mono-xs" style={{ marginBottom: 'var(--gap-24)' }}>
              Export your encrypted identity backup. The backup is already encrypted with your
              passphrase from identity creation.
            </p>
            <button onClick={handleExport} className="btn-primary btn-primary--full">
              Generate Backup
            </button>
            {exportData && (
              <div className="form-group" style={{ marginTop: 'var(--gap-24)' }}>
                <label className="rtf-label">Backup Data</label>
                <textarea readOnly value={exportData} className="rtf-textarea" />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(exportData);
                    setStatus('Copied to clipboard.');
                  }}
                  className="btn-ghost"
                  style={{ marginTop: 'var(--gap-8)' }}
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setView('status');
                resetFormState();
              }}
              className="btn-ghost btn-ghost--full"
              style={{ marginTop: 'var(--gap-12)' }}
            >
              Back
            </button>
          </div>
        )}

        {/* IMPORT View */}
        {view === 'import' && (
          <div>
            <p className="u-mono-xs" style={{ marginBottom: 'var(--gap-24)' }}>
              Import an identity from a backup. Enter the passphrase used during export.
            </p>
            <div className="form-group">
              <label className="rtf-label">Backup Data</label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste backup JSON here"
                className="rtf-textarea"
              />
            </div>
            <div className="form-group">
              <label className="rtf-label">Passphrase</label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="rtf-input"
              />
            </div>
            <div className="btn-row">
              <button onClick={handleImport} className="btn-primary" style={{ flex: 1 }}>
                Import
              </button>
              <button
                onClick={() => {
                  setView('status');
                  resetFormState();
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
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
