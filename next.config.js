import bundleAnalyzer from "@next/bundle-analyzer";
import crypto from "crypto";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

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
    // Enable webpack build worker
    webpackBuildWorker: true,
  },
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // Optimize bundle
  webpack: (config, { isServer }) => {
    // Enable tree shaking
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    // Split chunks for better caching
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunks
          framework: {
            name: "framework",
            chunks: "all",
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module) {
              return (
                module.size() > 160000 &&
                /node_modules[\\/]/.test(module.identifier())
              );
            },
            name(module) {
              const hash = crypto.createHash("sha256");
              hash.update(module.identifier());
              return hash.digest("hex").substring(0, 8);
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: "commons",
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name: "shared",
            test: /[\\/]components[\\/]|[\\/]lib[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
        maxAsyncRequests: 25,
        maxInitialRequests: 25,
      };
    }

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
