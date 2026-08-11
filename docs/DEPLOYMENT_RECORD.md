# Deployment Record

## Network: Polygon Amoy

| Field          | Value                                      |
| -------------- | ------------------------------------------ |
| Network        | Polygon Amoy Testnet                       |
| Chain ID       | 80002                                      |
| RPC URL        | https://polygon-amoy.drpc.org              |
| Block Explorer | https://amoy.polygonscan.com               |
| Deployer       | 0x0168B23EcDa6Bc972343c49ee2ed9e472FfA9af2 |
| Timestamp      | 2026-06-09T07:21:42Z                       |

---

## Groth16Verifier

| Field       | Value                                                                           |
| ----------- | ------------------------------------------------------------------------------- |
| Address     | 0xea39f8283fd5Ce927EE913Bd4f55b52Ec2AFA9E0                                      |
| Polygonscan | https://amoy.polygonscan.com/address/0xea39f8283fd5Ce927EE913Bd4f55b52Ec2AFA9E0 |
| Verified    | YES                                                                             |
| Source      | src/Verifier.sol                                                                |
| License     | GPL-3.0                                                                         |

---

## ConsentRegistry

| Field            | Value                                                                           |
| ---------------- | ------------------------------------------------------------------------------- |
| Address          | 0xa78Ad9B4bD61950ba670AAfFb8d1235c93c3BaBA                                      |
| Polygonscan      | https://amoy.polygonscan.com/address/0xa78Ad9B4bD61950ba670AAfFb8d1235c93c3BaBA |
| Verified         | YES                                                                             |
| Source           | src/ConsentRegistry.sol                                                         |
| License          | MIT                                                                             |
| Constructor Args | 0xea39f8283fd5Ce927EE913Bd4f55b52Ec2AFA9E0 (Groth16Verifier)                    |

---

## Compiler

| Field            | Value              |
| ---------------- | ------------------ |
| Solidity Version | 0.8.24             |
| Optimizer        | Enabled (200 runs) |
| EVM Version      | Default            |

---

## Verification

Both contracts verified on Polygonscan via `@nomicfoundation/hardhat-verify`.

- Groth16Verifier: https://amoy.polygonscan.com/address/0xea39f8283fd5Ce927EE913Bd4f55b52Ec2AFA9E0#code
- ConsentRegistry: https://amoy.polygonscan.com/address/0xa78Ad9B4bD61950ba670AAfFb8d1235c93c3BaBA#code

---

## Gas Costs (Measured)

| Function                             | Gas     |
| ------------------------------------ | ------- |
| registerConsent()                    | 67,941  |
| revokeConsent()                      | 30,823  |
| verifyAccess() (valid proof)         | 252,009 |
| verifyAccess() (revoked, early exit) | 33,870  |

---

## Frontend Configuration

After deployment, both frontend apps require the following environment variable:

```
NEXT_PUBLIC_CONSENT_REGISTRY_ADDRESS=0xa78Ad9B4bD61950ba670AAfFb8d1235c93c3BaBA
```

See `apps/user-vault/.env.example` and `apps/service-provider/.env.example` for full template.
