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

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Identity Management</h1>

      {status && (
        <div className="p-3 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">{status}</p>
        </div>
      )}

      {view === 'status' && (
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="font-medium mb-2">Identity Status</h2>
            {identityExists === null ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : identityExists ? (
              <p className="text-sm text-green-600 dark:text-green-400">Identity exists</p>
            ) : (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">No identity found</p>
            )}

            {identity && (
              <div className="mt-3 text-xs font-mono space-y-1 text-gray-500">
                <p>
                  userSecret: {identity.userSecret.slice(0, 10)}...{identity.userSecret.slice(-8)}
                </p>
                <p>consentVersion: {identity.consentVersion}</p>
              </div>
            )}

            {isDevMode() && (
              <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                Dev mode: auto-unlock enabled
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {!identityExists && (
              <button
                onClick={() => setView('create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Create Identity
              </button>
            )}
            {identityExists && !identity && (
              <button
                onClick={() => setView('unlock')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Unlock
              </button>
            )}
            {identityExists && (
              <button
                onClick={() => setView('export')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
              >
                Export Backup
              </button>
            )}
            <button
              onClick={() => setView('import')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
            >
              Import Backup
            </button>
          </div>
        </div>
      )}

      {view === 'create' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Create a new cryptographic identity. This will generate a random userSecret.
          </p>
          <div>
            <label className="block text-sm font-medium mb-1">Passphrase</label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Min 8 characters"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Passphrase</label>
            <input
              type="password"
              value={confirmPassphrase}
              onChange={(e) => setConfirmPassphrase(e.target.value)}
              placeholder="Repeat passphrase"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Create
            </button>
            <button
              onClick={() => {
                setView('status');
                setError('');
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {view === 'unlock' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Enter your passphrase to unlock your identity.</p>
          <div>
            <label className="block text-sm font-medium mb-1">Passphrase</label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleUnlock}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Unlock
            </button>
            <button
              onClick={() => {
                setView('status');
                setError('');
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {view === 'export' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Export your encrypted identity backup. Enter your passphrase to decrypt and re-encrypt
            for export.
          </p>
          <div>
            <label className="block text-sm font-medium mb-1">Passphrase</label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-sm"
            />
          </div>
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Generate Backup
          </button>
          {exportData && (
            <div>
              <label className="block text-sm font-medium mb-1">Backup Data</label>
              <textarea
                readOnly
                value={exportData}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs font-mono h-32"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportData);
                  setStatus('Copied to clipboard.');
                }}
                className="mt-2 text-sm text-blue-600 dark:text-blue-400"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setView('status');
              setError('');
              setExportData('');
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
          >
            Back
          </button>
        </div>
      )}

      {view === 'import' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Import an identity from a backup file. Enter the passphrase used during export.
          </p>
          <div>
            <label className="block text-sm font-medium mb-1">Backup Data</label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste backup JSON here"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-xs font-mono h-32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Passphrase</label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Import
            </button>
            <button
              onClick={() => {
                setView('status');
                setError('');
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
