pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";

/*
 * Consent Circuit
 *
 * Proves knowledge of (userSecret, spId, consentVersion) such that:
 *   consentId  == poseidon(userSecret, spId, consentVersion)
 *   nullifier  == poseidon(userSecret, consentId, spId)
 *
 * Private inputs: userSecret, spId, consentVersion
 * Public inputs:  consentId, nullifier
 *
 * Privacy guarantees:
 *   - userSecret is never revealed
 *   - spId is never revealed
 *   - consentVersion is never revealed
 *   - nullifier is per-consent (prevents cross-service linking)
 */
template Consent() {
    // Private inputs
    signal input userSecret;
    signal input spId;
    signal input consentVersion;

    // Public inputs
    signal input consentId;
    signal input nullifier;

    // Constraint 1: consentId == poseidon(userSecret, spId, consentVersion)
    component hashConsentId = Poseidon(3);
    hashConsentId.inputs[0] <== userSecret;
    hashConsentId.inputs[1] <== spId;
    hashConsentId.inputs[2] <== consentVersion;
    consentId === hashConsentId.out;

    // Constraint 2: nullifier == poseidon(userSecret, consentId, spId)
    component hashNullifier = Poseidon(3);
    hashNullifier.inputs[0] <== userSecret;
    hashNullifier.inputs[1] <== consentId;
    hashNullifier.inputs[2] <== spId;
    nullifier === hashNullifier.out;
}

component main {public [consentId, nullifier]} = Consent();
