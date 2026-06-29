import { dirname } from "path";
import { fileURLToPath } from "url";

import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import prettierPlugin from 'eslint-plugin-prettier';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import jsdocPlugin from 'eslint-plugin-jsdoc';

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    "node_modules/**",
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Main ruleset for JS/TS/JSX/TSX
  {
    files: [
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx'
    ],
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**'
    ],
    languageOptions: {
      ...reactPlugin.configs.flat.languageOptions,
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      // eslint-plugin-tailwindcss v4 needs the path to the Tailwind CSS entry
      // (the file with `@import "tailwindcss"`) to read the theme. Mandatory in v4;
      // it otherwise looks for the default `./src/style.css` and crashes with ENOENT.
      tailwindcss: {
        cssConfigPath: './app/globals.css',
      },
      // import/resolver settings are useful if you use path aliases (adjust if needed)
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
      next: nextPlugin,
      'react-hooks': reactHooksPlugin,
      tailwindcss: tailwindcssPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      jsdoc: jsdocPlugin,
    },
    rules: {
      // bring in recommended configs as base
      ...typescriptPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...reactPlugin.configs.flat.rules,
      ...reactHooksPlugin.configs['recommended-latest'].rules,
      ...tailwindcssPlugin.configs.recommended.rules,
      ...jsdocPlugin.configs['flat/recommended'].rules,

      // Prettier
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],

      // React
      'react/react-in-jsx-scope': 'off', // Next/React automatic runtime
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/function-component-definition': 'off',
      'react/destructuring-assignment': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',

      // Typescript / unused vars
      // disable base rule and use typescript-aware rule instead
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/comma-dangle': 'off',

      // Import / sorting
      'import/extensions': 'off',
      'import/order': 'off',
      'import/prefer-default-export': 'off',

      // strict sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Style / safety
      'no-restricted-syntax': [
        'error',
        'ForInStatement',
        'LabeledStatement',
        'WithStatement',
      ],

      'no-console': 'warn',
      
      // JSDoc rules
      'jsdoc/check-line-alignment': ['warn', 'always'],

      // Tailwind: this project ships a custom CSS design system (`btn`, `td`,
      // `slide-up`, `block-card`, …) and delegates class ordering to
      // prettier-plugin-tailwindcss. Disable the two tailwind rules that fight
      // those choices; keep the genuinely useful ones (enforces-shorthand,
      // no-unnecessary-arbitrary-value, no-contradicting-classname).
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'off',
    },
  },
]);

export default eslintConfig;