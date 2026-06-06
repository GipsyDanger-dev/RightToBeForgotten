'use client';

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
      <div className="max-w-lg mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-500 mb-4">Connect your wallet to view your consents.</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Consent Dashboard</h1>

      {error && (
        <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : consents.length === 0 ? (
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg text-center">
          <p className="text-gray-500">No consents registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {consents.map((c) => (
            <div
              key={c.consentId}
              className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Consent</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    c.state === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {c.state.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  <span className="font-mono">consentId:</span>{' '}
                  <span className="font-mono break-all">{formatConsentId(c.consentId)}</span>
                </p>
                <p>
                  <span className="font-mono">spId:</span>{' '}
                  <span className="font-mono">{c.spId}</span>
                </p>
                <p>
                  <span className="font-mono">version:</span> {c.consentVersion}
                </p>
                <p>
                  <span className="font-mono">registered:</span>{' '}
                  {new Date(c.registeredAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
