import type { Metadata } from 'next';
import { WalletProvider } from '@/components/WalletProvider';
import { Navigation } from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Service Provider — RTF',
  description: 'Privacy-preserving access verification',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <Navigation />
          <main>{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
