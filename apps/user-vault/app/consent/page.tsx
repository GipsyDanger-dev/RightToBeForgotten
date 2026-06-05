'use client';

import { useState } from 'react';
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
  const [error, setError] = useState('');

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

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

      setStatus('Submitting transaction...');
      const formattedCid = formatConsentId(cid);

      writeContract({
        address: CONSENT_REGISTRY_ADDRESS as `0x${string}`,
        abi: CONSENT_REGISTRY_ABI,
        functionName: 'registerConsent',
        args: [formattedCid as `0x${string}`],
      });

      // Save consent record locally
      await saveConsent({
        consentId: formattedCid,
        spId: spId.toLowerCase(),
        consentVersion: identity.consentVersion,
        state: 'active',
        registeredAt: Date.now(),
      });
    } catch (err) {
      setError((err as Error).message);
      setStatus('');
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Register Consent</h1>
        <p className="text-gray-500 mb-4">Connect your wallet to register consent.</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register Consent</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Service Provider Address (spId)</label>
          <input
            type="text"
            value={spId}
            onChange={(e) => setSpId(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-sm font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            The Ethereum wallet address of the service provider.
          </p>
        </div>

        {!isDevMode() && (
          <div>
            <label className="block text-sm font-medium mb-1">Passphrase</label>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter your passphrase"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-sm"
            />
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={isConfirming || !!txHash}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {isConfirming ? 'Confirming...' : txHash ? 'Submitted' : 'Register Consent'}
        </button>

        {status && <p className="text-sm text-blue-600 dark:text-blue-400">{status}</p>}
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        {isSuccess && consentId && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">
              Consent registered successfully!
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1 font-mono break-all">
              consentId: {formatConsentId(consentId)}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1 font-mono">
              tx: {txHash}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
