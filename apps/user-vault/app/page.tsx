'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { hasIdentity, isDevMode, devAutoUnlock } from '@/lib/identity';

export default function Home() {
  const [identityReady, setIdentityReady] = useState<boolean | null>(null);

  useEffect(() => {
    hasIdentity().then((exists) => {
      if (!exists && isDevMode()) {
        devAutoUnlock().then(() => setIdentityReady(true));
      } else {
        setIdentityReady(exists);
      }
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-4">RightToBeForgotten</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Privacy-preserving consent management using Zero-Knowledge Proofs. Register consent,
        generate proofs, and exercise your right to be forgotten.
      </p>

      <div className="space-y-4">
        {identityReady === false && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              No identity found. Generate one to get started.
            </p>
            <Link
              href="/identity"
              className="mt-2 inline-block text-sm text-yellow-900 dark:text-yellow-100 underline"
            >
              Generate Identity
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <h2 className="font-semibold mb-2">Dashboard</h2>
            <p className="text-sm text-gray-500">View and manage your active consents.</p>
          </Link>

          <Link
            href="/consent"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <h2 className="font-semibold mb-2">Register Consent</h2>
            <p className="text-sm text-gray-500">Register consent for a service provider.</p>
          </Link>

          <Link
            href="/revoke"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <h2 className="font-semibold mb-2">Revoke Consent</h2>
            <p className="text-sm text-gray-500">Exercise your right to be forgotten.</p>
          </Link>

          <Link
            href="/identity"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <h2 className="font-semibold mb-2">Identity</h2>
            <p className="text-sm text-gray-500">Manage your cryptographic identity.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
