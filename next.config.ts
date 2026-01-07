import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'plus.unsplash.com',
        protocol: 'https',
        port: ''
      },
      {
        hostname: 'mellow-meadowlark-778.convex.cloud',
        protocol: 'https',
        port: ''
      }
    ]
  }
};

export default nextConfig;
