import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },

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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname:
          "/dbcgdaigj/image/upload/v1788163976/Page_2-removebg-preview_oy5czj.png",
        search: "",
      },
    ],
  },
};

export default nextConfig;
