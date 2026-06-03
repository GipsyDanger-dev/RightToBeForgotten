// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ConsentRegistry
/// @notice Manages consent lifecycle for the RightToBeForgotten system.
/// @dev ConsentID is derived off-chain using poseidon(userSecret, serviceProviderId).
///      This contract does NOT store any user secrets, nullifiers, or PII.
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

    /// @notice Verify whether a consent is currently active.
    /// @param consentId The unique consent identifier to verify.
    /// @return True if consent is active, false otherwise.
    function verifyAccess(bytes32 consentId) external returns (bool) {
        bool isActive = _consentState[consentId] == 1;

        emit AccessVerified(consentId, isActive);

        return isActive;
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
}
