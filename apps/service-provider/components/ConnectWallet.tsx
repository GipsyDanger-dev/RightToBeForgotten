'use client';

import { ConnectKitButton } from 'connectkit';

export function ConnectWallet() {
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
