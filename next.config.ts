import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '**' },
      { protocol: 'https', hostname: 's3-figma-hubfile-images-production.figma.com' },
    ],
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],

}

export default nextConfig
