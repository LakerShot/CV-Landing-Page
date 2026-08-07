import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'coverage/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      'next-env.d.ts',
    ],
  },

  // `eslint-config-next` is still published as eslintrc-style, hence FlatCompat.
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },

  // Node-side scripts and config files.
  {
    files: ['scripts/**/*.mjs', '*.config.{ts,mjs}'],
    rules: { 'no-console': 'off' },
  },

  // Must stay last so formatting rules never conflict with Prettier.
  prettier,
);
