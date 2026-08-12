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
      <span className="nav-logo" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <rect width="64" height="64" rx="13" fill="#070707" />
          <path
            d="M32 9.5 L50.5 16.8 V31.5 C50.5 43.8 42 52.6 32 56.5 C22 52.6 13.5 43.8 13.5 31.5 V16.8 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="28.5" r="6.5" fill="#22c55e" />
          <path d="M30.2 34.5 h3.6 v7.5 h-3.6 z" fill="#22c55e" />
        </svg>
      </span>
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
