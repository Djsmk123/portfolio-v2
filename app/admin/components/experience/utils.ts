import type { experienceType, ExperienceType } from '@/app/data/mock'

type ExperienceRow = {
  id: string
  title: string
  company: string
  location: string
  // daterange from PG comes as string like "[2024-08-01,2025-10-01)" or "[2024-08-01,)"
  date: string
  description: string
  type: string
  is_active?: boolean | null
  isActive?: boolean | null
  created_at?: string | number | Date
  updated_at?: string | number | Date
  createdAt?: string | number | Date
  updatedAt?: string | number | Date
}

function fromPgRangeToUi (range: string): string {
  // Expect "[start,end)" where start/end are ISO dates; end may be empty
  const match = range.match(/^\[(.*?),(.*?)\)$/)
  if (!match) return range
  const startIso = match[1]
  const endIsoExclusive = match[2]
  const startMonth = startIso?.slice(0, 7)
  if (!endIsoExclusive || endIsoExclusive === '' ) {
    return `${startMonth} - Present`
  }
  // derive inclusive end month by subtracting one month from exclusive end
  const endDate = new Date(endIsoExclusive)
  // move to previous month
  endDate.setMonth(endDate.getMonth() - 1)
  const y = endDate.getFullYear()
  const m = String(endDate.getMonth() + 1).padStart(2, '0')
  const endMonth = `${y}-${m}`
  return `${startMonth} - ${endMonth}`
}


export const fromDb = (row: ExperienceRow): experienceType => ({
  id: row.id,
  title: row.title,
  company: row.company,
  location: row.location,
  date: fromPgRangeToUi(row.date),
  description: row.description,
  type: row.type as unknown as ExperienceType,
  isActive: (row.is_active ?? row.isActive) !== false,
  createdAt: ((row as unknown as { createdAt?: string | number | Date }).createdAt ?? row.created_at) as string | number | Date,
  updatedAt: ((row as unknown as { updatedAt?: string | number | Date }).updatedAt ?? row.updated_at) as string | number | Date
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


