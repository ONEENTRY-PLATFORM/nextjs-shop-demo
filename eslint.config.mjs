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
  ...compat.config({
    extends: [
      'eslint:recommended',
      // 'next',
      'next/typescript',
    ],
  }),
  ...compat.extends(
    'plugin:react/recommended',
    // 'next',
    // 'next/core-web-vitals',
    // 'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended'
  ),
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
        ecmaFeatures: {
          jsx: true,
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
      ...typescriptPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      // ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs.flat.rules,
      ...reactHooksPlugin.configs['recommended-latest'].rules,
      ...tailwindcssPlugin.configs["flat/recommended"].rules,
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
      'import/extensions': 'off',
      'react/function-component-definition': 'off',
      'react/destructuring-assignment': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',
      'eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-restricted-syntax': [
        'error',
        'ForInStatement',
        'LabeledStatement',
        'WithStatement',
      ],
      'import/prefer-default-export': 'off',
      // 'simple-import-sort/imports': 'error',
      // 'simple-import-sort/exports': 'error',
      'import/order': 'off',
      'no-console': 'warn',
      'no-unused-vars': 'warn',
    },
  }
];

export default eslintConfig;
