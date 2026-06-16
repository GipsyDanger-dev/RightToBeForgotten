'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectWallet } from './ConnectWallet';

const links = [
  { href: '/', label: 'Vault' },
  { href: '/identity', label: 'Identity' },
  { href: '/consent', label: 'Consent' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/revoke', label: 'Revoke' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <span className="nav-id">RTF · User Vault</span>
      <div className="nav-links">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} className={`nav-link${pathname === href ? ' active' : ''}`}>
            {label}
          </Link>
        ))}
      </div>
      <ConnectWallet />
      <div className="nav-hamburger" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
