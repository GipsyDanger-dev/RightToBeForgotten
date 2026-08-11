/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted Docker deployment (see deploy/vps/) uses the standalone output.
  output: 'standalone',
  // Next 14's `next lint` is incompatible with ESLint 9 (flat config). Linting
  // is handled by the root flat config via `npm run lint` / lint-staged instead.
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  transpilePackages: ['circomlibjs'],
};

module.exports = nextConfig;
