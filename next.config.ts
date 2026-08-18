/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Increase memory limit for development
  experimental: {
    // This helps with memory issues
    optimizeCss: true,
  },

  // Enable production source maps only in production
  productionBrowserSourceMaps: false,

  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Add transpile packages for React Query
  transpilePackages: [
    "@tanstack/react-query",
    "@tanstack/react-query-devtools",
  ],

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
