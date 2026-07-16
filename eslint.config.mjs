import { dirname } from 'path';
import { fileURLToPath } from 'url';

import prettierConfig from 'eslint-config-prettier';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.next-dev/**',
      '.open-next/**',
      '.wrangler/**',
      '.codegraph/**',
      '.archives/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '.prettierrc.js',
      'postcss.config.js',
      'stylelint.config.js',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ...prettierConfig,
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];

export default eslintConfig;
