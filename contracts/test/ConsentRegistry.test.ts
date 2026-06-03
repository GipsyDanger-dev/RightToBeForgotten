import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ConsentRegistry } from '../typechain-types';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

describe('ConsentRegistry', function () {
  let registry: ConsentRegistry;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  const CONSENT_ID_1 = ethers.keccak256(ethers.toUtf8Bytes('consent-1'));
  const CONSENT_ID_2 = ethers.keccak256(ethers.toUtf8Bytes('consent-2'));
  const ZERO_BYTES32 = ethers.ZeroHash;

  beforeEach(async function () {
    [, user1, user2] = await ethers.getSigners();
    const factory = await ethers.getContractFactory('ConsentRegistry');
    registry = await factory.deploy();
  });

  describe('registerConsent', function () {
    it('should register a new consent successfully', async function () {
      await expect(registry.connect(user1).registerConsent(CONSENT_ID_1))
        .to.emit(registry, 'ConsentRegistered')
        .withArgs(CONSENT_ID_1, user1.address);

      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(1);
    });

    it('should revert when consentId is zero', async function () {
      await expect(
        registry.connect(user1).registerConsent(ZERO_BYTES32)
      ).to.be.revertedWithCustomError(registry, 'InvalidConsentId');
    });

    it('should revert when consent already exists', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      await expect(
        registry.connect(user1).registerConsent(CONSENT_ID_1)
      ).to.be.revertedWithCustomError(registry, 'ConsentAlreadyExists');
    });

    it('should revert when registering a revoked consent', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      await registry.connect(user1).revokeConsent(CONSENT_ID_1);
      await expect(
        registry.connect(user1).registerConsent(CONSENT_ID_1)
      ).to.be.revertedWithCustomError(registry, 'ConsentAlreadyExists');
    });

    it('should allow multiple users to register different consents', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      await registry.connect(user2).registerConsent(CONSENT_ID_2);

      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(1);
      expect(await registry.getConsentState(CONSENT_ID_2)).to.equal(1);
    });

    it('should allow same user to register multiple consents', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      await registry.connect(user1).registerConsent(CONSENT_ID_2);

      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(1);
      expect(await registry.getConsentState(CONSENT_ID_2)).to.equal(1);
    });
  });

  describe('revokeConsent', function () {
    it('should revoke an active consent successfully', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);

      await expect(registry.connect(user1).revokeConsent(CONSENT_ID_1))
        .to.emit(registry, 'ConsentRevoked')
        .withArgs(CONSENT_ID_1, user1.address);

      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(2);
    });

    it('should revert when consent is not active', async function () {
      await expect(
        registry.connect(user1).revokeConsent(CONSENT_ID_1)
      ).to.be.revertedWithCustomError(registry, 'ConsentNotActive');
    });

    it('should revert when caller is not the registrant', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);

      await expect(
        registry.connect(user2).revokeConsent(CONSENT_ID_1)
      ).to.be.revertedWithCustomError(registry, 'Unauthorized');
    });

    it('should revert when revoking an already revoked consent', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      await registry.connect(user1).revokeConsent(CONSENT_ID_1);

      await expect(
        registry.connect(user1).revokeConsent(CONSENT_ID_1)
      ).to.be.revertedWithCustomError(registry, 'ConsentNotActive');
    });

    it('should permanently prevent re-registration after revocation', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      await registry.connect(user1).revokeConsent(CONSENT_ID_1);

      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(2);
      await expect(
        registry.connect(user1).registerConsent(CONSENT_ID_1)
      ).to.be.revertedWithCustomError(registry, 'ConsentAlreadyExists');
    });
  });

  describe('verifyAccess', function () {
    it('should return true for active consent', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);

      const result = await registry.verifyAccess.staticCall(CONSENT_ID_1);
      expect(result).to.equal(true);
    });

    it('should return false for non-existent consent', async function () {
      const result = await registry.verifyAccess.staticCall(CONSENT_ID_1);
      expect(result).to.equal(false);
    });

    it('should return false for revoked consent', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      await registry.connect(user1).revokeConsent(CONSENT_ID_1);

      const result = await registry.verifyAccess.staticCall(CONSENT_ID_1);
      expect(result).to.equal(false);
    });

    it('should emit AccessVerified event with true for active consent', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);

      await expect(registry.verifyAccess(CONSENT_ID_1))
        .to.emit(registry, 'AccessVerified')
        .withArgs(CONSENT_ID_1, true);
    });

    it('should emit AccessVerified event with false for revoked consent', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      await registry.connect(user1).revokeConsent(CONSENT_ID_1);

      await expect(registry.verifyAccess(CONSENT_ID_1))
        .to.emit(registry, 'AccessVerified')
        .withArgs(CONSENT_ID_1, false);
    });
  });

  describe('getConsentState', function () {
    it('should return 0 for non-existent consent', async function () {
      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(0);
    });

    it('should return 1 for active consent', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(1);
    });

    it('should return 2 for revoked consent', async function () {
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      await registry.connect(user1).revokeConsent(CONSENT_ID_1);
      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(2);
    });
  });

  describe('state transitions', function () {
    it('should follow correct state machine: NOT_REGISTERED -> ACTIVE -> REVOKED', async function () {
      // Initial state
      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(0);

      // NOT_REGISTERED -> ACTIVE
      await registry.connect(user1).registerConsent(CONSENT_ID_1);
      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(1);

      // ACTIVE -> REVOKED
      await registry.connect(user1).revokeConsent(CONSENT_ID_1);
      expect(await registry.getConsentState(CONSENT_ID_1)).to.equal(2);
    });
  });
});
