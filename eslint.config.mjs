import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

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
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", 
    "next/typescript"
  ),
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['node_modules/**', '.next/**', 'out/**'],
    languageOptions: {
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
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      next: nextPlugin,
      prettier: prettierPlugin,
      tailwindcss: tailwindcssPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs['recommended-latest'].rules,
      ...nextPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      // ...tailwindcssPlugin.configs.recommended,
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
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-restricted-syntax': [
        'error',
        'ForInStatement',
        'LabeledStatement',
        'WithStatement',
      ],
      'import/prefer-default-export': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/order': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'no-console': 'warn',
    },
  },
];

export default eslintConfig;
