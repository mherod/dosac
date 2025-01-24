/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Enable experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // Enable optimistic updates
    optimisticClientCache: true,
  },
};

module.exports = nextConfig;
