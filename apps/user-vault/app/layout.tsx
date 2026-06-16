import type { Metadata } from 'next';
import { WalletProvider } from '@/components/WalletProvider';
import { Navigation } from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'User Vault — RTF',
  description: 'Privacy-preserving consent management',
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
