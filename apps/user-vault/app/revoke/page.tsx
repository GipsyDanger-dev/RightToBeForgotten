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

  // Update local state after successful revocation
  useEffect(() => {
    if (isSuccess && selectedConsent) {
      updateConsentState(selectedConsent, 'revoked');
    }
  }, [isSuccess, selectedConsent]);

  if (!isConnected) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Revoke Consent</h1>
        <p className="text-gray-500 mb-4">Connect your wallet to revoke consent.</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Revoke Consent</h1>
      <p className="text-sm text-gray-500 mb-6">
        This action is irreversible. Once revoked, the consent cannot be reactivated.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : consents.length === 0 ? (
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg text-center">
          <p className="text-gray-500">No active consents to revoke.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Consent</label>
            <div className="space-y-2">
              {consents.map((c) => (
                <label
                  key={c.consentId}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedConsent === c.consentId
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="consent"
                    value={c.consentId}
                    checked={selectedConsent === c.consentId}
                    onChange={(e) => setSelectedConsent(e.target.value)}
                    className="mt-1"
                  />
                  <div className="text-xs font-mono">
                    <p>consentId: {formatConsentId(c.consentId)}</p>
                    <p className="text-gray-500">spId: {c.spId}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-red-800 dark:text-red-200">
              I understand this action is permanent and irreversible. The service provider will
              permanently lose the ability to verify this consent.
            </span>
          </label>

          <button
            onClick={handleRevoke}
            disabled={!selectedConsent || !confirmed || isConfirming || !!txHash}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {isConfirming ? 'Confirming...' : txHash ? 'Submitted' : 'Forget Me'}
          </button>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          {isSuccess && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                Consent revoked permanently.
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1 font-mono">
                tx: {txHash}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
