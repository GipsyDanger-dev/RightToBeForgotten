const { buildPoseidon } = require('circomlibjs');

async function main() {
  const poseidon = await buildPoseidon();
  const F = poseidon.F;

  // Test values
  const userSecret = 123456789n;
  const spId = 987654321n;
  const consentVersion = 1n;

  // consentId = poseidon(userSecret, spId, consentVersion)
  const consentIdHash = poseidon([userSecret, spId, consentVersion]);
  const consentId = F.toObject(consentIdHash);

  // nullifier = poseidon(userSecret, consentId, spId)
  const nullifierHash = poseidon([userSecret, consentId, spId]);
  const nullifier = F.toObject(nullifierHash);

  const input = {
    userSecret: userSecret.toString(),
    spId: spId.toString(),
    consentVersion: consentVersion.toString(),
    consentId: consentId.toString(),
    nullifier: nullifier.toString(),
  };

  console.log(JSON.stringify(input, null, 2));
}

main().catch(console.error);
