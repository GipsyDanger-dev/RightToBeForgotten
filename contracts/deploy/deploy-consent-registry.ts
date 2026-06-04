/* eslint-disable no-console */
import { ethers } from 'hardhat';

async function main() {
  // Deploy Groth16Verifier first
  const verifierFactory = await ethers.getContractFactory('Groth16Verifier');
  const verifier = await verifierFactory.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log(`Groth16Verifier deployed to: ${verifierAddress}`);

  // Deploy ConsentRegistry with verifier address
  const registryFactory = await ethers.getContractFactory('ConsentRegistry');
  const registry = await registryFactory.deploy(verifierAddress);
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`ConsentRegistry deployed to: ${registryAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
