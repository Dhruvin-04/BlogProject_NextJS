import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: 'plus.unsplash.com',
        protocol: 'https',
        port: ''
      },
      {
        hostname: 'unsplash-assets.imgix.net',
        protocol: 'https',
        port: ''
      },
      {
        hostname: 'descriptive-antelope-846.convex.cloud',
        protocol: 'https',
        port: ''
      }
    ]
  }
};

export default nextConfig;
