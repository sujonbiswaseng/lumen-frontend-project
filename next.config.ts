import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.pexels.com","res.cloudinary.com"], 
    formats: ["image/avif", "image/webp"] as const,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],

  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/auth/:path*',
  //       destination:`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/:path*`,
  //     },
  //     {
  //       source: '/api/v1/:path*',
  //       destination:`${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
  //     },
  //   ]
  // },
};

export default nextConfig;
