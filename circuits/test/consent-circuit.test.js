const { buildPoseidon } = require('circomlibjs');
const { groth16 } = require('snarkjs');
const path = require('path');
const fs = require('fs');

describe('Consent Circuit', function () {
  let poseidon;
  let F;

  const userSecret = 123456789n;
  const spId = 987654321n;
  const consentVersion = 1n;

  before(async function () {
    poseidon = await buildPoseidon();
    F = poseidon.F;
  });

  function computeConsentId(userSecret, spId, consentVersion) {
    const hash = poseidon([userSecret, spId, consentVersion]);
    return F.toObject(hash);
  }

  function computeNullifier(userSecret, consentId, spId) {
    const hash = poseidon([userSecret, consentId, spId]);
    return F.toObject(hash);
  }

  it('should compute consentId correctly', function () {
    const consentId = computeConsentId(userSecret, spId, consentVersion);
    expect(consentId.toString()).to.equal(
      '9310338589498860869070646930962201953388463726837628364057002895715177921913'
    );
  });

  it('should compute nullifier correctly', function () {
    const consentId = computeConsentId(userSecret, spId, consentVersion);
    const nullifier = computeNullifier(userSecret, consentId, spId);
    expect(nullifier.toString()).to.equal(
      '15709817962720630477077482648552381149510502584752004213288545285458818287313'
    );
  });

  it('should generate and verify proof', async function () {
    const consentId = computeConsentId(userSecret, spId, consentVersion);
    const nullifier = computeNullifier(userSecret, consentId, spId);

    const input = {
      userSecret: userSecret.toString(),
      spId: spId.toString(),
      consentVersion: consentVersion.toString(),
      consentId: consentId.toString(),
      nullifier: nullifier.toString(),
    };

    const wasmPath = path.join(__dirname, '..', 'build', 'consent_js', 'consent.wasm');
    const zkeyPath = path.join(__dirname, '..', 'build', 'consent_final.zkey');
    const vkPath = path.join(__dirname, '..', 'build', 'verification_key.json');

    const { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);

    const vk = JSON.parse(fs.readFileSync(vkPath, 'utf8'));
    const isValid = await groth16.verify(vk, publicSignals, proof);

    expect(isValid).to.equal(true);
  });

  it('should reject proof with wrong public signals', async function () {
    const consentId = computeConsentId(userSecret, spId, consentVersion);
    const nullifier = computeNullifier(userSecret, consentId, spId);

    const input = {
      userSecret: userSecret.toString(),
      spId: spId.toString(),
      consentVersion: consentVersion.toString(),
      consentId: consentId.toString(),
      nullifier: nullifier.toString(),
    };

    const wasmPath = path.join(__dirname, '..', 'build', 'consent_js', 'consent.wasm');
    const zkeyPath = path.join(__dirname, '..', 'build', 'consent_final.zkey');
    const vkPath = path.join(__dirname, '..', 'build', 'verification_key.json');

    const { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);

    // Tamper with public signals
    const tamperedSignals = ['1', publicSignals[1]];
    const vk = JSON.parse(fs.readFileSync(vkPath, 'utf8'));
    const isValid = await groth16.verify(vk, tamperedSignals, proof);

    expect(isValid).to.equal(false);
  });

  it('should produce different consentIds for different consentVersions', function () {
    const consentId1 = computeConsentId(userSecret, spId, 1n);
    const consentId2 = computeConsentId(userSecret, spId, 2n);

    expect(consentId1.toString()).to.not.equal(consentId2.toString());
  });

  it('should produce different nullifiers for different service providers', function () {
    const consentId = computeConsentId(userSecret, spId, consentVersion);
    const spId2 = 111222333n;

    const nullifier1 = computeNullifier(userSecret, consentId, spId);
    const nullifier2 = computeNullifier(userSecret, consentId, spId2);

    expect(nullifier1.toString()).to.not.equal(nullifier2.toString());
  });
});
