/* eslint-disable no-console */
import { ethers } from 'hardhat';

async function main() {
  const factory = await ethers.getContractFactory('ConsentRegistry');
  const registry = await factory.deploy();

  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`ConsentRegistry deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
