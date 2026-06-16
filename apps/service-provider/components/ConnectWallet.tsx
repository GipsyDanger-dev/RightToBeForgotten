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
      <button className="btn-wallet" style={{ opacity: 0.5 }}>
        Connect Wallet
      </button>
    );
  }

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress }) => (
        <button
          onClick={show}
          className={`btn-wallet${isConnected ? ' btn-wallet--connected' : ''}`}
        >
          {isConnected ? truncatedAddress : 'Connect Wallet'}
        </button>
      )}
    </ConnectKitButton.Custom>
  );
}
