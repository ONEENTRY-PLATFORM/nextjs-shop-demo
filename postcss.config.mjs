/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-import': {},
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    // eslint-disable-next-line no-undef
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};

export default config;
