/* eslint-disable no-console */
/**
 * Live on-chain validation of the revoke ("Forget Me") feature.
 *
 * Runs against the deployed ConsentRegistry on Polygon Amoy testnet using the
 * deployer account from the root .env (PRIVATE_KEY). Never prints the key.
 *
 * Usage:
 *   cd contracts && npx hardhat run scripts/test-revoke-live.ts --network polygonAmoy
 */
import type { BigNumberish } from 'ethers';
import { ethers } from 'hardhat';

const REGISTRY = '0xa78Ad9B4bD61950ba670AAfFb8d1235c93c3BaBA';

async function main() {
  const [signer] = await ethers.getSigners();
  console.log('signer:', signer.address);
  console.log('registry:', REGISTRY);

  const registry = await ethers.getContractAt('ConsentRegistry', REGISTRY);

  const consentId = ethers.keccak256(ethers.toUtf8Bytes(`rtbf-live-revoke-test-${Date.now()}`));
  console.log('consentId:', consentId);

  // 1. Register consent
  const regTx = await registry.registerConsent(consentId);
  const regReceipt = await regTx.wait();
  console.log('registerConsent TX:', regTx.hash, '(gas', regReceipt?.gasUsed.toString() + ')');
  console.log(
    'state after register:',
    (await registry.getConsentState(consentId)).toString(),
    '(1 = ACTIVE)'
  );

  // 2. Revoke consent (the core "Forget Me" feature)
  const revTx = await registry.revokeConsent(consentId);
  const revReceipt = await revTx.wait();
  console.log('revokeConsent TX:', revTx.hash, '(gas', revReceipt?.gasUsed.toString() + ')');
  console.log(
    'state after revoke:',
    (await registry.getConsentState(consentId)).toString(),
    '(2 = REVOKED)'
  );
  console.log(
    'isConsentActive after revoke:',
    await registry.isConsentActive(consentId),
    '(expected false)'
  );

  // 3. Revocation finality: re-registering the same consentId must revert
  try {
    const reTx = await registry.registerConsent(consentId);
    await reTx.wait();
    console.log('RE-REGISTER: UNEXPECTED SUCCESS - BUG!');
    process.exitCode = 1;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log('re-register correctly reverted:', msg.split('\n')[0].slice(0, 140));
  }

  // 4. verifyAccess on a REVOKED consent must be denied (early exit, no proof needed)
  const zero: [BigNumberish, BigNumberish] = [0, 0];
  const zeroB: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]] = [
    [0, 0],
    [0, 0],
  ];
  const zeroNullifier = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const denied = await registry.verifyAccess.staticCall(
    consentId,
    zero,
    zeroB,
    zero,
    zeroNullifier
  );
  console.log('verifyAccess (revoked) returned:', denied, '(expected false)');
  const verTx = await registry.verifyAccess(consentId, zero, zeroB, zero, zeroNullifier);
  const verReceipt = await verTx.wait();
  console.log(
    'verifyAccess (revoked) TX:',
    verTx.hash,
    '(gas',
    verReceipt?.gasUsed.toString() + ')'
  );

  // 5. Registry still points at the deployed verifier (sanity)
  console.log('verifier():', await registry.verifier());

  console.log(
    '\nRESULT: Flow B (register -> revoke -> verify denied) validated on live Polygon Amoy.'
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
