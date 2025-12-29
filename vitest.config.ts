import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/unit-setup.ts'],
    include: [
      '**/__tests__/**/*.{test,spec}.{ts,tsx}',
      '**/tests/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/tests/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/e2e/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/.{idea,git,cache,output,temp}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
