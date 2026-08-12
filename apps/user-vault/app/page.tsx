'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { hasIdentity, isDevMode, devAutoUnlock } from '@/lib/identity';

export default function Home() {
  const [identityReady, setIdentityReady] = useState<boolean | null>(null);

  useEffect(() => {
    hasIdentity().then((exists) => {
      if (!exists && isDevMode()) {
        devAutoUnlock().then(() => setIdentityReady(true));
      } else {
        setIdentityReady(exists);
      }
    });
  }, []);

  return (
    <>
      {/* Warning Banner */}
      {identityReady === false && (
        <div className="warning-banner">
          <span className="warning-dot"></span>
          <span className="warning-text">
            No identity found. <Link href="/identity">Generate one to get started.</Link>
          </span>
        </div>
      )}

      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">Right to be Forgotten · User Vault</p>
        <h1 className="hero-title">
          Your data.
          <br />
          <span className="muted">Your rules.</span>
        </h1>
        <div className="hero-body">
          <p className="hero-desc">
            Privacy-preserving consent management using Zero-Knowledge Proofs. Register consent,
            generate proofs, and exercise your right to be forgotten — without ever revealing your
            identity.
          </p>
          <div>
            <div className="hero-deco-num">05</div>
            <div className="hero-deco-label">modules</div>
          </div>
        </div>
      </section>

      {/* Navigation List */}
      <ul className="nav-list">
        <li className="nav-list-item">
          <Link href="/dashboard">
            <span className="nl-num">01</span>
            <span className="nl-title">Dashboard</span>
            <div className="nl-meta">
              <span className="nl-tag">consent overview</span>
              <span className="nl-desc">View and manage all your registered consents</span>
            </div>
            <span className="nl-arrow">↗</span>
          </Link>
        </li>
        <li className="nav-list-item">
          <Link href="/consent">
            <span className="nl-num">02</span>
            <span className="nl-title">Register Consent</span>
            <div className="nl-meta">
              <span className="nl-tag">new consent</span>
              <span className="nl-desc">Authorize a service provider with ZK proof</span>
            </div>
            <span className="nl-arrow">↗</span>
          </Link>
        </li>
        <li className="nav-list-item nav-list-item--danger">
          <Link href="/revoke">
            <span className="nl-num">03</span>
            <span className="nl-title">Revoke Consent</span>
            <div className="nl-meta">
              <span className="nl-tag">destructive</span>
              <span className="nl-desc">Permanently revoke access — irreversible</span>
            </div>
            <span className="nl-arrow">↗</span>
          </Link>
        </li>
        <li className="nav-list-item">
          <Link href="/proof">
            <span className="nl-num">04</span>
            <span className="nl-title">Generate Proof</span>
            <div className="nl-meta">
              <span className="nl-tag">zero-knowledge</span>
              <span className="nl-desc">Create a ZK proof locally — your secret never leaves</span>
            </div>
            <span className="nl-arrow">↗</span>
          </Link>
        </li>
        <li className="nav-list-item">
          <Link href="/identity">
            <span className="nl-num">05</span>
            <span className="nl-title">Identity</span>
            <div className="nl-meta">
              <span className="nl-tag">cryptographic identity</span>
              <span className="nl-desc">Create, unlock, export, or import your identity</span>
            </div>
            <span className="nl-arrow">↗</span>
          </Link>
        </li>
      </ul>

      {/* Footer Stats */}
      <div className="footer-stats">
        <div className="fs-cell">
          <span className="fs-label">Network</span>
          <span className="fs-value">Polygon Amoy</span>
        </div>
        <div className="fs-cell">
          <span className="fs-label">Identity</span>
          <span className={`fs-value ${identityReady ? 'fs-value--green' : 'fs-value--red'}`}>
            {identityReady ? 'Ready' : 'Not Found'}
          </span>
        </div>
        <div className="fs-cell">
          <span className="fs-label">ZK Circuit</span>
          <span className="fs-value">Groth16 · Poseidon</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-spacer"></div>
      <div className="bottom-bar">
        <div className="bb-left">
          <span className="bb-item">
            <span className="bb-dot"></span>polygon amoy
          </span>
        </div>
        <div className="bb-right">
          <span className="bb-item">v1.0.0</span>
        </div>
      </div>
    </>
  );
}
