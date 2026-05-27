import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
      },
    ],
  },
}

export default nextConfig
