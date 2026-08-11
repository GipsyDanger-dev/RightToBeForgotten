/**
 * Round-trip export/import test for identity.ts
 * 
 * Tests the core encrypt/decrypt logic using Web Crypto API.
 * Run: node --experimental-vm-modules scripts/test-export-import.mjs
 * 
 * This validates:
 * 1. Encrypt → decrypt round-trip preserves identity
 * 2. Wrong passphrase fails decryption
 * 3. Wrong version format fails import
 * 4. Tampered ciphertext fails decryption
 */

// Web Crypto API is available in Node.js 18+
const { subtle } = globalThis.crypto;

// --- Replicate crypto helpers from identity.ts ---

async function deriveKey(passphrase, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(data, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const encoder = new TextEncoder();
  const encrypted = await subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(data));
  const packed = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  packed.set(salt, 0);
  packed.set(iv, salt.length);
  packed.set(new Uint8Array(encrypted), salt.length + iv.length);
  return btoa(String.fromCharCode(...packed));
}

async function decrypt(encoded, passphrase) {
  const packed = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
  const salt = packed.slice(0, 16);
  const iv = packed.slice(16, 28);
  const ciphertext = packed.slice(28);
  const key = await deriveKey(passphrase, salt);
  const decrypted = await subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

// --- Replicate export/import logic from identity.ts ---

function generateIdentity() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const userSecret = '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return { userSecret, consentVersion: 1 };
}

async function exportIdentity(identity, passphrase) {
  const encrypted = await encrypt(JSON.stringify(identity), passphrase);
  return JSON.stringify({ version: 1, data: encrypted });
}

async function importIdentity(exportedJson, passphrase) {
  const { version, data } = JSON.parse(exportedJson);
  if (version !== 1) throw new Error('Unsupported version');
  const json = await decrypt(data, passphrase);
  return JSON.parse(json);
}

// --- Test runner ---

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

async function testRoundTrip() {
  console.log('\nTest 1: Encrypt → decrypt round-trip');
  const passphrase = 'test-passphrase-123';
  const identity = generateIdentity();

  const exported = await exportIdentity(identity, passphrase);
  const imported = await importIdentity(exported, passphrase);

  assert(imported.userSecret === identity.userSecret, 'userSecret preserved');
  assert(imported.consentVersion === identity.consentVersion, 'consentVersion preserved');
  assert(imported.userSecret.startsWith('0x'), 'userSecret is hex string');
  assert(imported.userSecret.length === 66, 'userSecret is 32 bytes (66 chars with 0x)');
}

async function testWrongPassphrase() {
  console.log('\nTest 2: Wrong passphrase fails');
  const identity = generateIdentity();
  const exported = await exportIdentity(identity, 'correct-passphrase');

  try {
    await importIdentity(exported, 'wrong-passphrase');
    assert(false, 'Should have thrown');
  } catch (_e) {
    assert(true, 'Wrong passphrase throws error');
  }
}

async function testWrongVersion() {
  console.log('\nTest 3: Wrong version format fails');
  const identity = generateIdentity();
  const encrypted = await encrypt(JSON.stringify(identity), 'passphrase');
  const badExport = JSON.stringify({ version: 99, data: encrypted });

  try {
    await importIdentity(badExport, 'passphrase');
    assert(false, 'Should have thrown');
  } catch (e) {
    assert(e.message === 'Unsupported version', 'Wrong version throws error');
  }
}

async function testTamperedData() {
  console.log('\nTest 4: Tampered ciphertext fails');
  const identity = generateIdentity();
  const exported = await exportIdentity(identity, 'passphrase');
  const parsed = JSON.parse(exported);

  // Tamper with the encrypted data
  const tampered = JSON.stringify({ version: 1, data: parsed.data.slice(0, -5) + 'AAAAA' });

  try {
    await importIdentity(tampered, 'passphrase');
    assert(false, 'Should have thrown');
  } catch (_e) {
    assert(true, 'Tampered data throws error');
  }
}

async function testMultipleIdentities() {
  console.log('\nTest 5: Multiple identities round-trip');
  const passphrase = 'multi-test-pass';

  for (let i = 0; i < 5; i++) {
    const identity = generateIdentity();
    const exported = await exportIdentity(identity, passphrase);
    const imported = await importIdentity(exported, passphrase);

    assert(imported.userSecret === identity.userSecret, `identity ${i} userSecret preserved`);
    assert(imported.consentVersion === identity.consentVersion, `identity ${i} consentVersion preserved`);
  }
}

async function testDifferentPassphrases() {
  console.log('\nTest 6: Same identity, different passphrases');
  const identity = generateIdentity();

  const exported1 = await exportIdentity(identity, 'passphrase-A');
  const exported2 = await exportIdentity(identity, 'passphrase-B');

  const imported1 = await importIdentity(exported1, 'passphrase-A');
  const imported2 = await importIdentity(exported2, 'passphrase-B');

  assert(imported1.userSecret === identity.userSecret, 'passphrase-A decrypts correctly');
  assert(imported2.userSecret === identity.userSecret, 'passphrase-B decrypts correctly');
  assert(exported1 !== exported2, 'different passphrases produce different ciphertexts');
}

async function testEmptyPassphrase() {
  console.log('\nTest 7: Empty passphrase works (valid but not recommended)');
  const identity = generateIdentity();
  const exported = await exportIdentity(identity, '');
  const imported = await importIdentity(exported, '');

  assert(imported.userSecret === identity.userSecret, 'empty passphrase round-trips');
}

async function testIdentityFormat() {
  console.log('\nTest 8: Export format validation');
  const identity = generateIdentity();
  const exported = await exportIdentity(identity, 'passphrase');
  const parsed = JSON.parse(exported);

  assert(parsed.version === 1, 'version field is 1');
  assert(typeof parsed.data === 'string', 'data field is string');
  assert(parsed.data.length > 100, 'data field has content');
}

// --- Run all tests ---

async function main() {
  console.log('=== Export/Import Round-Trip Tests ===');

  await testRoundTrip();
  await testWrongPassphrase();
  await testWrongVersion();
  await testTamperedData();
  await testMultipleIdentities();
  await testDifferentPassphrases();
  await testEmptyPassphrase();
  await testIdentityFormat();

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
