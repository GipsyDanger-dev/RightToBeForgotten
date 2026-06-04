/* eslint-disable no-console */
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ConsentRegistry, Groth16Verifier } from '../typechain-types';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

describe('Phase 3 Integration: ConsentRegistry + Verifier', function () {
  let registry: ConsentRegistry;
  let verifier: Groth16Verifier;
  let user1: HardhatEthersSigner;

  // consentId = poseidon(123456789, 987654321, 1)
  const CONSENT_ID = '0x149577039c8c5462083036005ad462e67eb423d912c7590ba145c3350750fd79';
  // nullifier = poseidon(123456789, consentId, 987654321)
  const NULLIFIER = '0x22bb711e229163f0ac20da51b20f629de8918939fe1307a97df316f8e9acc6d1';

  // Valid proof for the above consentId and nullifier
  const proof = {
    a: [
      '0x29a5abf33b15a27b4816f49e83df7319f4e1df6ddd318b5bfe1891996f55ae1f',
      '0x0efb29de9b984465f0cd46a2e7620f393bf757c855cea3be004b4092640f367f',
    ] as [string, string],
    b: [
      [
        '0x19ea7ef2e16bc4bd5e649a82447b9c34aa8da4c61d5ebf944b78b0c1df6a2f33',
        '0x1c9e747086c1da5cce65f7df23ab8e0a19a0b86801a0cf64412a050972c9a784',
      ],
      [
        '0x1d51fc53f823a979422e339acd21fb599ffd8c1598df06940c9d34a0c479cdba',
        '0x2f28d9c66ca0a38f750ffbb390103e423533e48462124b981b6d69d4e1e9d44f',
      ],
    ] as [[string, string], [string, string]],
    c: [
      '0x24304ca6c4864871e7ba9894f489b60889147fda1dbf2fada895bddc0e92d271',
      '0x099e5acdf85c79cd87ee277baf6a444f1e011e9d89233164b8fe50fe49246b00',
    ] as [string, string],
  };

  beforeEach(async function () {
    [, user1] = await ethers.getSigners();

    const verifierFactory = await ethers.getContractFactory('Groth16Verifier');
    verifier = await verifierFactory.deploy();

    const registryFactory = await ethers.getContractFactory('ConsentRegistry');
    registry = await registryFactory.deploy(await verifier.getAddress());

    // Register consent for testing
    await registry.connect(user1).registerConsent(CONSENT_ID);
  });

  describe('verifyAccess with ZK proof', function () {
    it('should return true for valid proof with active consent', async function () {
      const result = await registry.verifyAccess.staticCall(
        CONSENT_ID,
        proof.a,
        proof.b,
        proof.c,
        NULLIFIER
      );
      expect(result).to.equal(true);
    });

    it('should emit AccessVerified event with true on success', async function () {
      await expect(registry.verifyAccess(CONSENT_ID, proof.a, proof.b, proof.c, NULLIFIER))
        .to.emit(registry, 'AccessVerified')
        .withArgs(CONSENT_ID, true);
    });

    it('should mark nullifier as used after successful verification', async function () {
      expect(await registry.isNullifierUsed(NULLIFIER)).to.equal(false);

      await registry.verifyAccess(CONSENT_ID, proof.a, proof.b, proof.c, NULLIFIER);

      expect(await registry.isNullifierUsed(NULLIFIER)).to.equal(true);
    });

    it('should reject replay attack (same nullifier twice)', async function () {
      // First verification succeeds
      const result1 = await registry.verifyAccess.staticCall(
        CONSENT_ID,
        proof.a,
        proof.b,
        proof.c,
        NULLIFIER
      );
      expect(result1).to.equal(true);

      // Execute first verification to mark nullifier
      await registry.verifyAccess(CONSENT_ID, proof.a, proof.b, proof.c, NULLIFIER);

      // Second verification with same nullifier fails
      const result2 = await registry.verifyAccess.staticCall(
        CONSENT_ID,
        proof.a,
        proof.b,
        proof.c,
        NULLIFIER
      );
      expect(result2).to.equal(false);
    });

    it('should return false for revoked consent', async function () {
      await registry.connect(user1).revokeConsent(CONSENT_ID);

      const result = await registry.verifyAccess.staticCall(
        CONSENT_ID,
        proof.a,
        proof.b,
        proof.c,
        NULLIFIER
      );
      expect(result).to.equal(false);
    });

    it('should return false for non-existent consent', async function () {
      const fakeConsentId = ethers.keccak256(ethers.toUtf8Bytes('non-existent'));

      const result = await registry.verifyAccess.staticCall(
        fakeConsentId,
        proof.a,
        proof.b,
        proof.c,
        NULLIFIER
      );
      expect(result).to.equal(false);
    });

    it('should return false for zero consentId', async function () {
      const result = await registry.verifyAccess.staticCall(
        ethers.ZeroHash,
        proof.a,
        proof.b,
        proof.c,
        NULLIFIER
      );
      expect(result).to.equal(false);
    });

    it('should return false for tampered proof', async function () {
      const tamperedA: [string, string] = [
        '0x0000000000000000000000000000000000000000000000000000000000000001',
        proof.a[1],
      ];

      const result = await registry.verifyAccess.staticCall(
        CONSENT_ID,
        tamperedA,
        proof.b,
        proof.c,
        NULLIFIER
      );
      expect(result).to.equal(false);
    });

    it('should emit AccessVerified with false for failed verification', async function () {
      await registry.connect(user1).revokeConsent(CONSENT_ID);

      await expect(registry.verifyAccess(CONSENT_ID, proof.a, proof.b, proof.c, NULLIFIER))
        .to.emit(registry, 'AccessVerified')
        .withArgs(CONSENT_ID, false);
    });
  });

  describe('isConsentActive', function () {
    it('should return true for active consent', async function () {
      expect(await registry.isConsentActive(CONSENT_ID)).to.equal(true);
    });

    it('should return false for revoked consent', async function () {
      await registry.connect(user1).revokeConsent(CONSENT_ID);
      expect(await registry.isConsentActive(CONSENT_ID)).to.equal(false);
    });

    it('should return false for non-existent consent', async function () {
      const fakeConsentId = ethers.keccak256(ethers.toUtf8Bytes('non-existent'));
      expect(await registry.isConsentActive(fakeConsentId)).to.equal(false);
    });
  });

  describe('isNullifierUsed', function () {
    it('should return false for unused nullifier', async function () {
      expect(await registry.isNullifierUsed(NULLIFIER)).to.equal(false);
    });

    it('should return true after nullifier is used', async function () {
      await registry.verifyAccess(CONSENT_ID, proof.a, proof.b, proof.c, NULLIFIER);
      expect(await registry.isNullifierUsed(NULLIFIER)).to.equal(true);
    });
  });

  describe('gas measurement', function () {
    it('should measure gas for verifyAccess() with valid proof', async function () {
      const gas = await registry.verifyAccess.estimateGas(
        CONSENT_ID,
        proof.a,
        proof.b,
        proof.c,
        NULLIFIER
      );
      console.log(`    verifyAccess() with proof gas estimated: ${gas}`);
    });

    it('should measure gas for verifyAccess() on revoked consent (early exit)', async function () {
      await registry.connect(user1).revokeConsent(CONSENT_ID);
      const gas = await registry.verifyAccess.estimateGas(
        CONSENT_ID,
        proof.a,
        proof.b,
        proof.c,
        NULLIFIER
      );
      console.log(`    verifyAccess() revoked consent gas estimated: ${gas}`);
    });
  });
});
