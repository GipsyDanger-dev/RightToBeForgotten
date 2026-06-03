/* eslint-disable no-console */
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Groth16Verifier } from '../typechain-types';

describe('Consent Circuit - On-Chain Verification', function () {
  let verifier: Groth16Verifier;

  // Proof generated from circuit test (userSecret=123456789, spId=987654321, consentVersion=1)
  const proof = {
    a: [
      '0x29a5abf33b15a27b4816f49e83df7319f4e1df6ddd318b5bfe1891996f55ae1f',
      '0x0efb29de9b984465f0cd46a2e7620f393bf757c855cea3be004b4092640f367f',
    ],
    b: [
      [
        '0x19ea7ef2e16bc4bd5e649a82447b9c34aa8da4c61d5ebf944b78b0c1df6a2f33',
        '0x1c9e747086c1da5cce65f7df23ab8e0a19a0b86801a0cf64412a050972c9a784',
      ],
      [
        '0x1d51fc53f823a979422e339acd21fb599ffd8c1598df06940c9d34a0c479cdba',
        '0x2f28d9c66ca0a38f750ffbb390103e423533e48462124b981b6d69d4e1e9d44f',
      ],
    ],
    c: [
      '0x24304ca6c4864871e7ba9894f489b60889147fda1dbf2fada895bddc0e92d271',
      '0x099e5acdf85c79cd87ee277baf6a444f1e011e9d89233164b8fe50fe49246b00',
    ],
    publicSignals: [
      '0x149577039c8c5462083036005ad462e67eb423d912c7590ba145c3350750fd79',
      '0x22bb711e229163f0ac20da51b20f629de8918939fe1307a97df316f8e9acc6d1',
    ],
  };

  beforeEach(async function () {
    const factory = await ethers.getContractFactory('Groth16Verifier');
    verifier = await factory.deploy();
  });

  it('should verify a valid proof', async function () {
    const result = await verifier.verifyProof.staticCall(
      proof.a,
      proof.b,
      proof.c,
      proof.publicSignals
    );
    expect(result).to.equal(true);
  });

  it('should reject proof with tampered public signals', async function () {
    const tamperedSignals = [
      '0x0000000000000000000000000000000000000000000000000000000000000001',
      proof.publicSignals[1],
    ];
    const result = await verifier.verifyProof.staticCall(
      proof.a,
      proof.b,
      proof.c,
      tamperedSignals
    );
    expect(result).to.equal(false);
  });

  it('should reject proof with tampered A point', async function () {
    const tamperedA = [
      '0x0000000000000000000000000000000000000000000000000000000000000001',
      proof.a[1],
    ];
    const result = await verifier.verifyProof.staticCall(
      tamperedA,
      proof.b,
      proof.c,
      proof.publicSignals
    );
    expect(result).to.equal(false);
  });

  it('should reject proof with tampered C point', async function () {
    const tamperedC = [
      '0x0000000000000000000000000000000000000000000000000000000000000001',
      proof.c[1],
    ];
    const result = await verifier.verifyProof.staticCall(
      proof.a,
      proof.b,
      tamperedC,
      proof.publicSignals
    );
    expect(result).to.equal(false);
  });

  it('should measure gas for on-chain proof verification', async function () {
    const gas = await verifier.verifyProof.estimateGas(
      proof.a,
      proof.b,
      proof.c,
      proof.publicSignals
    );
    console.log(`    verifyProof() gas estimated: ${gas}`);
  });
});
