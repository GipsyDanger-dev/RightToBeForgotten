'use client';

import { openDB, DBSchema, IDBPDatabase } from 'idb';

// --- Types ---

export interface Identity {
  userSecret: string; // hex string
  consentVersion: number;
}

interface IdentityDB extends DBSchema {
  identity: {
    key: string;
    value: string; // encrypted JSON
  };
  consents: {
    key: string; // consentId
    value: {
      consentId: string;
      spId: string;
      consentVersion: number;
      state: 'active' | 'revoked';
      registeredAt: number;
    };
    indexes: { 'by-spId': string };
  };
}

const DB_NAME = 'rtbf-user-vault';
const DB_VERSION = 1;
const IDENTITY_KEY = 'identity';

// --- Crypto helpers ---

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(data: string, passphrase: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(data));
  // Pack salt + iv + ciphertext as base64
  const packed = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  packed.set(salt, 0);
  packed.set(iv, salt.length);
  packed.set(new Uint8Array(encrypted), salt.length + iv.length);
  return btoa(String.fromCharCode(...packed));
}

async function decrypt(encoded: string, passphrase: string): Promise<string> {
  const packed = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
  const salt = packed.slice(0, 16);
  const iv = packed.slice(16, 28);
  const ciphertext = packed.slice(28);
  const key = await deriveKey(passphrase, salt);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

// --- Random identity generation ---

function generateRandomHex(byteLength: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return (
    '0x' +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function generateIdentity(): Identity {
  return {
    userSecret: generateRandomHex(32), // 256-bit
    consentVersion: 1,
  };
}

// --- Database ---

async function getDB(): Promise<IDBPDatabase<IdentityDB>> {
  return openDB<IdentityDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('identity')) {
        db.createObjectStore('identity');
      }
      if (!db.objectStoreNames.contains('consents')) {
        const store = db.createObjectStore('consents', { keyPath: 'consentId' });
        store.createIndex('by-spId', 'spId');
      }
    },
  });
}

// --- Identity persistence ---

export async function saveIdentity(identity: Identity, passphrase: string): Promise<void> {
  const db = await getDB();
  const encrypted = await encrypt(JSON.stringify(identity), passphrase);
  await db.put('identity', encrypted, IDENTITY_KEY);
}

export async function loadIdentity(passphrase: string): Promise<Identity | null> {
  const db = await getDB();
  const encrypted = await db.get('identity', IDENTITY_KEY);
  if (!encrypted) return null;
  try {
    const json = await decrypt(encrypted, passphrase);
    return JSON.parse(json) as Identity;
  } catch {
    return null; // wrong passphrase or corrupted data
  }
}

export async function hasIdentity(): Promise<boolean> {
  const db = await getDB();
  const val = await db.get('identity', IDENTITY_KEY);
  return val !== undefined;
}

// --- Consent persistence ---

export interface ConsentRecord {
  consentId: string;
  spId: string;
  consentVersion: number;
  state: 'active' | 'revoked';
  registeredAt: number;
}

export async function saveConsent(record: ConsentRecord): Promise<void> {
  const db = await getDB();
  await db.put('consents', record);
}

export async function getConsent(consentId: string): Promise<ConsentRecord | undefined> {
  const db = await getDB();
  return db.get('consents', consentId);
}

export async function getAllConsents(): Promise<ConsentRecord[]> {
  const db = await getDB();
  return db.getAll('consents');
}

export async function getConsentsBySpId(spId: string): Promise<ConsentRecord[]> {
  const db = await getDB();
  return db.getAllFromIndex('consents', 'by-spId', spId);
}

export async function updateConsentState(
  consentId: string,
  state: 'active' | 'revoked'
): Promise<void> {
  const db = await getDB();
  const record = await db.get('consents', consentId);
  if (record) {
    record.state = state;
    await db.put('consents', record);
  }
}

// --- Identity export/import ---

export async function exportIdentity(_passphrase: string): Promise<string | null> {
  const db = await getDB();
  const encrypted = await db.get('identity', IDENTITY_KEY);
  if (!encrypted) return null;
  return JSON.stringify({ version: 1, data: encrypted });
}

export async function importIdentity(
  exportedJson: string,
  passphrase: string
): Promise<Identity | null> {
  try {
    const { version, data } = JSON.parse(exportedJson);
    if (version !== 1) return null;
    const json = await decrypt(data, passphrase);
    const identity = JSON.parse(json) as Identity;
    // Save to local DB
    const db = await getDB();
    await db.put('identity', data, IDENTITY_KEY);
    return identity;
  } catch {
    return null;
  }
}

// --- Dev mode auto-unlock ---

const DEV_PASSPHRASE = 'dev-mode-auto-unlock';

export async function devAutoUnlock(): Promise<Identity> {
  const existing = await loadIdentity(DEV_PASSPHRASE);
  if (existing) return existing;
  const identity = generateIdentity();
  await saveIdentity(identity, DEV_PASSPHRASE);
  return identity;
}

export function isDevMode(): boolean {
  return process.env.NODE_ENV === 'development';
}
