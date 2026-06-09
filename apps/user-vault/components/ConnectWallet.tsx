'use client';

import { useEffect, useState } from 'react';
import { ConnectKitButton } from 'connectkit';

export function ConnectWallet() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium opacity-50">
        Connect Wallet
      </button>
    );
  }

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress }) => (
        <button
          onClick={show}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {isConnected ? truncatedAddress : 'Connect Wallet'}
        </button>
      )}
    </ConnectKitButton.Custom>
  );
}
