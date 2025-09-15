import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from '@eslint/js';

import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import prettierPlugin from 'eslint-plugin-prettier';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts"
    ]
  },
  // Base extends via compat to support flat config plugins
  ...compat.config({
    extends: [
      'eslint:recommended',
      // 'next',
      'next/typescript',
    ],
  }),
  // legacy compat extends for some plugins
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:@next/next/recommended'
  ),

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
    },
    rules: {
      // bring in recommended configs as base
      ...typescriptPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...reactPlugin.configs.flat.rules,
      ...reactHooksPlugin.configs['recommended-latest'].rules,
      ...tailwindcssPlugin.configs['flat/recommended'].rules,

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
    },
  }
];

export default eslintConfig;
