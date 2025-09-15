import type { projectType } from '@/app/data/mock'

export const fromDb = (row: any): projectType => ({
  id: row.id,
  name: row.name,
  desc: row.description,
  tags: Array.isArray(row.tags) ? row.tags : [],
  images: Array.isArray(row.images) ? row.images : [],
  links: { playstore: row.playstore || '', appstore: row.appstore || '', website: row.website || '' },
  github: row.github || '',
  org: { name: row.org_name || '', logo: row.org_logo || '', url: row.org_url || '' },
  // map DB flag to UI
  isActive: row.is_active !== false,
  createdAt: row.created_at,
  updatedAt: row.updated_at
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
  is_active: p.hasOwnProperty('isActive') ? Boolean((p as any).isActive) : true
})


