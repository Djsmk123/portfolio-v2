import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com'
      },
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'https',
        hostname: 's3-figma-hubfile-images-production.figma.com'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'img.buymeacoffee.com'
      }
    ]
  },
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    'localhost',
    '127.0.0.1',
    '192.168.1.42'
  ]
}

export default nextConfig
