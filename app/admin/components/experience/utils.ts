import type { experienceType } from '@/app/data/mock'

export const fromDb = (row: any): experienceType => ({
  id: row.id,
  title: row.title,
  company: row.company,
  location: row.location,
  date: row.date,
  description: row.description,
  type: row.type,
  isActive: row.is_active !== false,
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

export const toDb = (e: experienceType) => ({
  title: e.title,
  company: e.company,
  location: e.location,
  date: e.date,
  description: e.description,
  type: e.type,
  is_active: e.hasOwnProperty('isActive') ? Boolean((e as any).isActive) : true
})


