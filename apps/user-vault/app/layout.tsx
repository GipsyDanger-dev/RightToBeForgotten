import type { Metadata } from 'next';
import { WalletProvider } from '@/components/WalletProvider';
import { Navigation } from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'User Vault - RightToBeForgotten',
  description: 'Privacy-preserving consent management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
