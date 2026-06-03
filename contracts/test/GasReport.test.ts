/* eslint-disable no-console */
import { ethers } from 'hardhat';
import { ConsentRegistry } from '../typechain-types';

describe('Gas Report', function () {
  let registry: ConsentRegistry;

  const CONSENT_ID = ethers.keccak256(ethers.toUtf8Bytes('gas-test-consent'));

  beforeEach(async function () {
    const factory = await ethers.getContractFactory('ConsentRegistry');
    registry = await factory.deploy();
  });

  it('should measure gas for registerConsent()', async function () {
    const tx = await registry.registerConsent(CONSENT_ID);
    const receipt = await tx.wait();
    console.log(`    registerConsent() gas used: ${receipt?.gasUsed}`);
  });

  it('should measure gas for revokeConsent()', async function () {
    await registry.registerConsent(CONSENT_ID);
    const tx = await registry.revokeConsent(CONSENT_ID);
    const receipt = await tx.wait();
    console.log(`    revokeConsent() gas used: ${receipt?.gasUsed}`);
  });

  it('should measure gas for verifyAccess()', async function () {
    await registry.registerConsent(CONSENT_ID);
    const tx = await registry.verifyAccess(CONSENT_ID);
    const receipt = await tx.wait();
    console.log(`    verifyAccess() gas used: ${receipt?.gasUsed}`);
  });

  it('should measure gas for getConsentState()', async function () {
    await registry.registerConsent(CONSENT_ID);
    const gas = await registry.getConsentState.estimateGas(CONSENT_ID);
    console.log(`    getConsentState() gas estimated: ${gas}`);
  });
});
