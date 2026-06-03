# Scripts

Utility scripts for RightToBeForgotten development.

## Available npm Scripts (root)

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run lint`         | Run ESLint across the project            |
| `npm run format`       | Format all files with Prettier           |
| `npm run format:check` | Check formatting without modifying files |
| `npm run typecheck`    | Run TypeScript type checking             |
| `npm run clean`        | Remove all node_modules directories      |
| `npm run prepare`      | Install Husky git hooks                  |

## Contracts Scripts

Run from `contracts/` directory:

| Script                 | Description                     |
| ---------------------- | ------------------------------- |
| `npm run compile`      | Compile Solidity contracts      |
| `npm run test`         | Run contract tests              |
| `npm run deploy:local` | Deploy to local Hardhat network |
| `npm run deploy:amoy`  | Deploy to Polygon Amoy testnet  |
| `npm run coverage`     | Generate test coverage report   |

## Circuits Scripts

Run from `circuits/` directory:

| Script                 | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run compile`      | Compile Circom circuit              |
| `npm run setup`        | Run trusted setup ceremony          |
| `npm run gen-verifier` | Generate Solidity verifier contract |
| `npm run gen-proof`    | Generate a zero-knowledge proof     |
| `npm run verify`       | Verify a generated proof            |
