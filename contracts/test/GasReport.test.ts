/* eslint-disable no-console */
import { ethers } from 'hardhat';
import { ConsentRegistry, Groth16Verifier } from '../typechain-types';

describe('Gas Report', function () {
  let registry: ConsentRegistry;
  let verifier: Groth16Verifier;

  const CONSENT_ID = ethers.keccak256(ethers.toUtf8Bytes('gas-test-consent'));

  beforeEach(async function () {
    const verifierFactory = await ethers.getContractFactory('Groth16Verifier');
    verifier = await verifierFactory.deploy();

    const registryFactory = await ethers.getContractFactory('ConsentRegistry');
    registry = await registryFactory.deploy(await verifier.getAddress());
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

  it('should measure gas for isConsentActive()', async function () {
    await registry.registerConsent(CONSENT_ID);
    const gas = await registry.isConsentActive.estimateGas(CONSENT_ID);
    console.log(`    isConsentActive() gas estimated: ${gas}`);
  });

  it('should measure gas for getConsentState()', async function () {
    await registry.registerConsent(CONSENT_ID);
    const gas = await registry.getConsentState.estimateGas(CONSENT_ID);
    console.log(`    getConsentState() gas estimated: ${gas}`);
  });
});
