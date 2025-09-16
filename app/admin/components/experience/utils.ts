import type { experienceType } from '@/app/data/mock'


export const fromDb = (row: experienceType): experienceType => ({
  id: row.id,
  title: row.title,
  company: row.company,
  location: row.location,
  date: row.date,
  description: row.description,
  type: row.type,
  isActive: row.isActive !== false,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt
})

export const toDb = (e: experienceType) => ({
  title: e.title,
  company: e.company,
  location: e.location,
  date: e.date,
  description: e.description,
  type: e.type,
  is_active: typeof e.isActive === 'boolean' ? e.isActive : true
})


