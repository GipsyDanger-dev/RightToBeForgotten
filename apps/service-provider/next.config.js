/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted Docker deployment (see deploy/vps/) uses the standalone output.
  output: 'standalone',
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
