import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: "export",
    typescript: {
      ignoreBuildErrors: true,
    },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cyberpet.com',
      },
      // 如果还有其他域名的图片，可以继续添加
      {
        protocol: 'https',
        hostname: 'aggregator.walrus-testnet.walrus.space',
      },
    ],
  },
};

export default nextConfig;
