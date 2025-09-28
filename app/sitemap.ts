import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://smkwinner.vercel.app').replace(/\/$/, '')
  const routes = ['', '/projects', '/experience', '/blogs', '/contact']
  const now = new Date()
  return routes.map((path) => ({
    url: `${baseUrl}${path || '/'}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))
}


