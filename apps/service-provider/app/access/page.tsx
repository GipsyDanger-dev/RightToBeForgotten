'use client';

import { useEffect, useState } from 'react';

export default function AccessPage() {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const result = sessionStorage.getItem('verificationResult');
    setVerified(result === 'true');
  }, []);

  if (!verified) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Protected Content</h1>
        <p className="text-gray-500 mb-4">
          You must verify your authorization before accessing this content.
        </p>
        <a href="/verify" className="text-sm text-blue-600 dark:text-blue-400 underline">
          Go to Verification
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Protected Content</h1>
      <p className="text-sm text-gray-500 mb-6">
        Your authorization has been verified via Zero-Knowledge Proof. Your identity remains
        private.
      </p>

      <div className="p-6 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h2 className="font-medium text-green-800 dark:text-green-200 mb-3">Access Granted</h2>
        <p className="text-sm text-green-700 dark:text-green-300 mb-4">
          This content is only accessible to users with valid, active consent. The verification was
          performed using a Zero-Knowledge Proof, meaning:
        </p>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">-</span>
            <span>Your identity (userSecret) was never revealed</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">-</span>
            <span>Only the validity of your consent was confirmed</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">-</span>
            <span>The nullifier prevents this proof from being replayed</span>
          </li>
        </ul>
      </div>

      <div className="mt-6 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Demo Content</h3>
        <p className="text-sm text-gray-500">
          This is a demonstration of privacy-preserving access control. In a real application, this
          page would contain sensitive data that only authorized users should see.
        </p>
      </div>

      <button
        onClick={() => {
          sessionStorage.removeItem('verificationResult');
          sessionStorage.removeItem('proofData');
          window.location.href = '/';
        }}
        className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
