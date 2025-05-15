/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    // optimizeCss: true,
    optimizePackageImports: ['gsap', 'react-toastify'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 1920],
    // imageSizes: [32, 64, 128, 256],
    // qualities: [50, 75],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'react-native-course.oneentry.cloud',
        port: '',
        pathname: '/cloud-static/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/password',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
