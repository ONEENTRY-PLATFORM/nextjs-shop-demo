/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  /**
   * A prerender that hits a CMS blip retries instead of shipping the failure.
   * `getProductById` now throws on anything but a 404, so a rate-limited build fails the page
   * rather than baking `notFound()` into it — with retries, a blip costs a second attempt
   * instead of the whole build.
   */
  experimental: {
    /**
     * Prerender workers. Next defaults to one per core (11 here) and the CMS does not survive
     * that fanout: a full-parallelism build answers `<!DOCTYPE …>` instead of JSON
     * (`statusCode: 0`) for dozens of reads, and a worker eventually dies outright. Four keeps
     * every read clean.
     */
    cpus: 4,
    staticGenerationRetryCount: 3,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    optimizeCss: true,
    optimizePackageImports: ['gsap', 'react-toastify'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // OneEntry CDN URLs (/cloud-static/**) are immutable per file — the optimized
    // variant never needs to change, so cache it for a year. The previous 60s TTL
    // made the edge re-fetch from compute every minute, re-encoding and
    // re-streaming each product photo back to the CDN on a loop.
    minimumCacheTTL: 31536000,
    // Trimmed to the breakpoints the layout actually uses: every extra entry is
    // another variant the optimizer may be asked to generate and store.
    deviceSizes: [640, 768, 1024, 1280, 1920, 2560],
    imageSizes: [16, 32, 64, 96, 128, 256],
    qualities: [50, 75],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.oneentry.cloud',
        port: '',
        pathname: '/cloud-static/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ];
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
  async rewrites() {
    return [
      {
        source: '/fonts/:path*',
        destination: '/api/fonts/:path*',
      },
    ];
  },
  compress: true,
  // Do not advertise the framework: `X-Powered-By: Next.js` tells a scanner
  // which CVE list to try. Covered by tests/e2e/security-headers.spec.ts.
  poweredByHeader: false,
};

export default nextConfig;
