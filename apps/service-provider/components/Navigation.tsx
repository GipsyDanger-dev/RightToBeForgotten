'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectWallet } from './ConnectWallet';

const links = [
  { href: '/', label: 'Login' },
  { href: '/verify', label: 'Verify' },
  { href: '/access', label: 'Access' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <span className="nav-id">RTF · Service Provider</span>
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
