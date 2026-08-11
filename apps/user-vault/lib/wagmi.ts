'use client';

import { http, fallback, createConfig } from 'wagmi';
import { polygonAmoy, hardhat, type Chain } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

// Polygon Labs retired the official Amoy RPC endpoint (July 2026).
// Override viem's chain defaults so every consumer (wagmi, ConnectKit,
// wallet add-network flows) uses a live community endpoint.
const polygonAmoyLive: Chain = {
  ...polygonAmoy,
  rpcUrls: {
    ...polygonAmoy.rpcUrls,
    default: {
      http: ['https://polygon-amoy.drpc.org', 'https://polygon-amoy-bor-rpc.publicnode.com'],
    },
  },
};

const chains =
  process.env.NODE_ENV === 'development'
    ? ([hardhat, polygonAmoyLive] as const)
    : ([polygonAmoyLive] as const);

export const config = createConfig(
  getDefaultConfig({
    chains,
    transports: {
      [hardhat.id]: http('http://127.0.0.1:8545'),
      [polygonAmoyLive.id]: fallback([
        http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || 'https://polygon-amoy.drpc.org'),
        http('https://polygon-amoy-bor-rpc.publicnode.com'),
      ]),
    },
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID &&
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== 'demo'
        ? process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
        : '',
    appName: 'RightToBeForgotten - User Vault',
    appDescription: 'Privacy-preserving consent management',
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
