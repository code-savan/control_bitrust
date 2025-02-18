import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost:3000', 'kyedlygmqhupslfefjqx.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kyedlygmqhupslfefjqx.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
