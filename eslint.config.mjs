import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'apps/*/node_modules/**',
      'contracts/node_modules/**',
      'circuits/node_modules/**',
      'circuits/build/**',
      'circuits/proofs/**',
      'dist/**',
      'build/**',
      'artifacts/**',
      'cache/**',
      'coverage/**',
      'typechain-types/**',
    ],
  }
);
