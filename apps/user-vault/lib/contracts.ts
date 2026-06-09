// Contract ABIs and addresses

export const CONSENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS!;

export const CONSENT_REGISTRY_ABI = [
  {
    inputs: [{ internalType: 'bytes32', name: 'consentId', type: 'bytes32' }],
    name: 'registerConsent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'consentId', type: 'bytes32' }],
    name: 'revokeConsent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'consentId', type: 'bytes32' },
      { internalType: 'uint256[2]', name: 'pA', type: 'uint256[2]' },
      { internalType: 'uint256[2][2]', name: 'pB', type: 'uint256[2][2]' },
      { internalType: 'uint256[2]', name: 'pC', type: 'uint256[2]' },
      { internalType: 'bytes32', name: 'nullifier', type: 'bytes32' },
    ],
    name: 'verifyAccess',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'consentId', type: 'bytes32' }],
    name: 'getConsentState',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'consentId', type: 'bytes32' }],
    name: 'isConsentActive',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'nullifier', type: 'bytes32' }],
    name: 'isNullifierUsed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'consentId', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'registrant', type: 'address' },
    ],
    name: 'ConsentRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'consentId', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'revoker', type: 'address' },
    ],
    name: 'ConsentRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'consentId', type: 'bytes32' },
      { indexed: false, internalType: 'bool', name: 'result', type: 'bool' },
    ],
    name: 'AccessVerified',
    type: 'event',
  },
] as const;
