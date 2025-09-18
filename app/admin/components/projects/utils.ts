import type { projectType } from '@/app/data/mock'

type ProjectRow = {
  id: string
  name: string
  description: string
  tags?: unknown
  images?: unknown
  playstore?: string | null
  appstore?: string | null
  website?: string | null
  github?: string | null
  org_name?: string | null
  org_logo?: string | null
  org_url?: string | null
  is_active?: boolean | null
  created_at?: string | number | Date
  updated_at?: string | number | Date
}

export const fromDb = (row: ProjectRow): projectType => ({
  id: row.id,
  name: row.name,
  desc: row.description,
  tags: Array.isArray(row.tags) ? row.tags as string[] : [],
  images: Array.isArray(row.images) ? row.images as string[] : [],
  links: { playstore: row.playstore || '', appstore: row.appstore || '', website: row.website || '' },
  github: row.github || '',
  org: { name: row.org_name || '', logo: row.org_logo || '', url: row.org_url || '' },
  // map DB flag to UI
  isActive: row.is_active !== false,
  createdAt: row.created_at as string | number | Date,
  updatedAt: row.updated_at as string | number | Date
})

export const toDb = (p: projectType) => ({
  name: p.name,
  description: p.desc,
  tags: Array.isArray(p.tags) ? p.tags : [],
  images: Array.isArray(p.images) ? p.images : [],
  github: p.github || null,
  website: p.links?.website || null,
  playstore: p.links?.playstore || null,
  appstore: p.links?.appstore || null,
  org_name: p.org?.name || null,
  org_logo: p.org?.logo || null,
  org_url: p.org?.url || null,
  // map UI flag to DB
  is_active: typeof p.isActive === 'boolean' ? p.isActive : true
})


