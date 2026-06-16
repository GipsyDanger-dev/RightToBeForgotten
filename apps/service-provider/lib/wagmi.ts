'use client';

import { http, createConfig } from 'wagmi';
import { polygonAmoy, hardhat } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

const chains =
  process.env.NODE_ENV === 'development'
    ? ([hardhat, polygonAmoy] as const)
    : ([polygonAmoy] as const);

export const config = createConfig(
  getDefaultConfig({
    chains,
    transports: {
      [hardhat.id]: http('http://127.0.0.1:8545'),
      [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC),
    },
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID &&
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== 'demo'
        ? process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
        : '',
    appName: 'RightToBeForgotten - Service Provider',
    appDescription: 'Privacy-preserving access verification',
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
