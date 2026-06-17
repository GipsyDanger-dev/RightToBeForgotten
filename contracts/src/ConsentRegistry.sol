// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IVerifier
/// @notice Interface for the Groth16 proof verifier.
interface IVerifier {
    function verifyProof(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[2] calldata _pubSignals
    ) external view returns (bool);
}

/// @title ConsentRegistry
/// @notice Manages consent lifecycle and ZK proof verification for the RightToBeForgotten system.
/// @dev ConsentID is derived off-chain using poseidon(userSecret, serviceProviderId, consentVersion).
///      This contract does NOT store any user secrets or PII.
///      Nullifiers are tracked to prevent replay attacks.
contract ConsentRegistry {
    // ──────────────────────────────────────────────
    // Errors
    // ──────────────────────────────────────────────

    /// @notice Thrown when consentId is zero bytes.
    error InvalidConsentId();

    /// @notice Thrown when attempting to register an already-existing consent.
    error ConsentAlreadyExists();

    /// @notice Thrown when attempting to act on a consent that is not active.
    error ConsentNotActive();

    /// @notice Thrown when caller is not the consent registrant.
    error Unauthorized();

    /// @notice Thrown when a nullifier has already been used.
    error NullifierAlreadyUsed();

    /// @notice Thrown when verifier address is zero.
    error InvalidVerifier();

    // ──────────────────────────────────────────────
    // Events
    // ──────────────────────────────────────────────

    /// @notice Emitted when a new consent is registered.
    /// @param consentId The unique consent identifier.
    /// @param registrant The address that registered the consent.
    event ConsentRegistered(bytes32 indexed consentId, address indexed registrant);

    /// @notice Emitted when an active consent is revoked.
    /// @param consentId The unique consent identifier.
    /// @param revoker The address that revoked the consent.
    event ConsentRevoked(bytes32 indexed consentId, address indexed revoker);

    /// @notice Emitted when access is verified.
    /// @param consentId The unique consent identifier.
    /// @param result Whether access is granted.
    event AccessVerified(bytes32 indexed consentId, bool result);

    // ──────────────────────────────────────────────
    // State
    // ──────────────────────────────────────────────

    /// @dev Consent state values:
    ///   0 = NOT_REGISTERED (default)
    ///   1 = ACTIVE
    ///   2 = REVOKED
    mapping(bytes32 => uint8) private _consentState;

    /// @dev Maps consentId to the address that registered it.
    mapping(bytes32 => address) private _consentRegistrant;

    /// @dev Tracks which nullifiers have been used to prevent replay attacks.
    mapping(bytes32 => bool) private _usedNullifiers;

    /// @dev The Groth16 verifier contract address.
    IVerifier public immutable verifier;

    // ──────────────────────────────────────────────
    // Constructor
    // ──────────────────────────────────────────────

    /// @param _verifier Address of the deployed Groth16Verifier contract.
    constructor(IVerifier _verifier) {
        if (address(_verifier) == address(0)) revert InvalidVerifier();
        verifier = _verifier;
    }

    // ──────────────────────────────────────────────
    // External Functions
    // ──────────────────────────────────────────────

    /// @notice Register a new consent.
    /// @param consentId The unique consent identifier derived off-chain.
    function registerConsent(bytes32 consentId) external {
        if (consentId == bytes32(0)) revert InvalidConsentId();
        if (_consentState[consentId] != 0) revert ConsentAlreadyExists();

        // Effects
        _consentState[consentId] = 1;
        _consentRegistrant[consentId] = msg.sender;

        // Interaction
        emit ConsentRegistered(consentId, msg.sender);
    }

    /// @notice Revoke an active consent. This action is irreversible.
    /// @param consentId The unique consent identifier to revoke.
    function revokeConsent(bytes32 consentId) external {
        if (_consentState[consentId] != 1) revert ConsentNotActive();
        if (_consentRegistrant[consentId] != msg.sender) revert Unauthorized();

        // Effects
        _consentState[consentId] = 2;

        // Interaction
        emit ConsentRevoked(consentId, msg.sender);
    }

    /// @notice Verify access using a ZK proof and consent state.
    /// @dev Validates consent is ACTIVE, nullifier is fresh, and proof is valid.
    ///      Uses Checks-Effects-Interactions pattern for reentrancy safety.
    /// @param consentId The consent identifier (public signal from circuit).
    /// @param pA Groth16 proof component A.
    /// @param pB Groth16 proof component B.
    /// @param pC Groth16 proof component C.
    /// @param nullifier The nullifier from circuit (public signal).
    /// @return True if proof is valid, consent is active, and nullifier is fresh.
    function verifyAccess(
        bytes32 consentId,
        uint256[2] calldata pA,
        uint256[2][2] calldata pB,
        uint256[2] calldata pC,
        bytes32 nullifier
    ) external returns (bool) {
        // ── Checks ──
        if (consentId == bytes32(0)) {
            emit AccessVerified(consentId, false);
            return false;
        }

        if (_consentState[consentId] != 1) {
            emit AccessVerified(consentId, false);
            return false;
        }

        if (_usedNullifiers[nullifier]) {
            emit AccessVerified(consentId, false);
            return false;
        }

        // ── Interaction: verify proof ──
        uint256[2] memory pubSignals = [uint256(consentId), uint256(nullifier)];
        bool proofValid = verifier.verifyProof(pA, pB, pC, pubSignals);

        if (!proofValid) {
            emit AccessVerified(consentId, false);
            return false;
        }

        // ── Effects: mark nullifier as used ──
        _usedNullifiers[nullifier] = true;

        // ── Interaction: emit event ──
        emit AccessVerified(consentId, true);
        return true;
    }

    // ──────────────────────────────────────────────
    // View Functions
    // ──────────────────────────────────────────────

    /// @notice Get the current state of a consent.
    /// @param consentId The unique consent identifier.
    /// @return state 0=NOT_REGISTERED, 1=ACTIVE, 2=REVOKED.
    function getConsentState(bytes32 consentId) external view returns (uint8 state) {
        return _consentState[consentId];
    }

    /// @notice Check if a consent is currently active (no proof required).
    /// @param consentId The unique consent identifier.
    /// @return True if consent is active.
    function isConsentActive(bytes32 consentId) external view returns (bool) {
        return _consentState[consentId] == 1;
    }

    /// @notice Check if a nullifier has been used.
    /// @param nullifier The nullifier to check.
    /// @return True if nullifier has been used.
    function isNullifierUsed(bytes32 nullifier) external view returns (bool) {
        return _usedNullifiers[nullifier];
    }
}
