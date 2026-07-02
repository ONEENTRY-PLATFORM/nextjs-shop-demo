import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  roots: ['<rootDir>/tests/jest'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/tests/**',
    '!**/coverage/**',
  ],
};

// html-react-parser and its dependency chain ship untranspiled ESM. Custom
// transformIgnorePatterns can't help: next/jest APPENDS its own hardcoded
// node_modules ignore pattern, and a file is skipped if ANY pattern matches.
// So the packages are injected into next/jest's own allowlist instead.
const ESM_PACKAGES = [
  'html-react-parser',
  'html-dom-parser',
  'react-property',
  'domhandler',
  'domelementtype',
  'dom-serializer',
  'htmlparser2',
  'entities',
  'inline-style-parser',
  'style-to-js',
  'style-to-object',
].join('|');

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
const buildJestConfig = async () => {
  const config = await createJestConfig(customJestConfig)();
  config.transformIgnorePatterns = (config.transformIgnorePatterns ?? []).map(
    (pattern) =>
      // `(?!(` opens the transpile allowlist inside next/jest's node_modules patterns.
      pattern.includes('node_modules')
        ? pattern.replace('(?!(', `(?!(${ESM_PACKAGES}|`)
        : pattern,
  );
  return config;
};

export default buildJestConfig;
