import { NextResponse } from 'next/server'
import { withApiMiddleware } from '@/lib/api-middleware'
import { supabase, getTableName } from '@/lib/supabase'
import { z } from 'zod'

const TABLE = getTableName('skills')

type DbSkill = {
  id: string
  name: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  years_of_experience?: number | null
  yearsOfExperience?: number | null
  icon?: string | null
  color?: string | null
  is_active?: boolean | null
  updated_at?: string | null
}

const normalizeSkill = (row: DbSkill) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  level: row.level,
  yearsOfExperience: (row.yearsOfExperience ?? row.years_of_experience ?? 0) as number,
  icon: row.icon ?? null,
  color: row.color ?? null,
  is_active: row.is_active ?? true,
})

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  yearsOfExperience: z.coerce.number().int().min(0).max(50),
  icon: z.string().optional().nullable(),
  color: z.string().min(1).optional().nullable(),
  is_active: z.boolean().optional().nullable()
})

export const GET = withApiMiddleware(async ({ req }) => {
  const { searchParams } = new URL(req.url)
  const schema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    activeType: z.coerce.number().int().max(2).default(0)
  })
  const { page, limit, search, category, activeType } = schema.parse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    activeType: searchParams.get('activeType') ?? undefined
  })

  const offset = (page - 1) * limit
  let query = supabase
    .from(TABLE)
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (activeType === 1) query = query.eq('is_active', true)
  if (activeType === 2) query = query.eq('is_active', false)
  if (category) query = query.eq('category', category)
  if (search && search.trim()) query = query.ilike('name', `%${search.trim()}%`)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const skills = Array.isArray(data) ? (data as DbSkill[]).map(normalizeSkill) : []
  return NextResponse.json({ skills, total: count ?? 0, page, limit })
})

export const POST = withApiMiddleware(async ({ json }) => {
  const body = await json()
  const parsed = skillSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const payload = {
    name: parsed.data.name,
    category: parsed.data.category,
    level: parsed.data.level,
    years_of_experience: parsed.data.yearsOfExperience,
    icon: parsed.data.icon || null,
    color: parsed.data.color || null,
    is_active: parsed.data.is_active ?? true
  }
  const { data, error } = await supabase.from(TABLE).insert(payload).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ skill: normalizeSkill(data as DbSkill) }, { status: 201 })
})

export const PATCH = withApiMiddleware(async ({ json }) => {
  const body = await json()
  const schema = skillSchema.extend({ id: z.string().min(1) })
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const payload = {
    name: parsed.data.name,
    category: parsed.data.category,
    level: parsed.data.level,
    years_of_experience: parsed.data.yearsOfExperience,
    icon: parsed.data.icon || null,
    color: parsed.data.color || null,
    is_active: parsed.data.is_active ?? true
  }
  const { data, error } = await supabase.from(TABLE).update(payload).eq('id', parsed.data.id).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ skill: normalizeSkill(data as DbSkill) }, { status: 200 })
})

export const DELETE = withApiMiddleware(async ({ req }) => {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') || ''
  const parsed = z.object({ id: z.string().min(1) }).safeParse({ id })
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { error } = await supabase.from(TABLE).delete().eq('id', parsed.data.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
})


