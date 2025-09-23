/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // DO NOT IGNORE ERRORS IN BUILD
    ignoreDuringBuilds: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Configure build timeouts and static generation
  staticPageGenerationTimeout: 300, // 5 minutes instead of default 60 seconds
  generateBuildId: async () => {
    // Use timestamp to ensure unique builds
    return `build-${Date.now()}`;
  },
  // Enable experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // Enable optimistic updates
    optimisticClientCache: true,
    // Enable Partial Prerendering (PPR)
    ppr: "incremental",
  },
};

export default nextConfig;
