import { NextResponse } from 'next/server'
import { withApiMiddleware } from '@/lib/api-middleware'
import { supabase, getTableName } from '@/lib/supabase'
import { z } from 'zod'

const TABLE = getTableName('experiences')

// Schemas
const experienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  description: z.string().min(1),
  type: z.string().min(1),
  is_active: z.boolean().optional().nullable()
})

export const GET = withApiMiddleware(async ({ req }) => {
  try {
    const { searchParams } = new URL(req.url)
    const schema = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
      search: z.string().optional().nullable(),
      type: z.string().optional().nullable(),
      activeType: z.coerce.number().int().max(2).default(0)
    })
    const { page, limit, search, type, activeType } = schema.parse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      type: searchParams.get('type') ?? undefined,
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
    if (type) query = query.eq('type', type)
    if (search && search.trim()) {
      const s = `%${search.trim()}%`
      query = query.or(`title.ilike.${s},company.ilike.${s},description.ilike.${s}`)
    }

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({
      experiences: data ?? [],
      total: count ?? 0,
      page,
      limit
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
})

export const POST = withApiMiddleware(async ({ json }) => {
  const body = await json()
  const parsed = experienceSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { title, company, location, date, description, type, is_active } = parsed.data
  const payload = {
    title,
    company,
    location,
    date,
    description,
    type,
    is_active: typeof is_active === 'boolean' ? is_active : true
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ experience: data }, { status: 201 })
})

export const PATCH = withApiMiddleware(async ({ json }) => {
  const body = await json()
  const schema = experienceSchema.extend({ id: z.string().min(1) })
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { id, title, company, location, date, description, type, is_active } = parsed.data as z.infer<typeof schema>
  const payload = {
    title, company, location, date, description, type,
    is_active: typeof is_active === 'boolean' ? is_active : true
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ experience: data }, { status: 200 })
})

export const DELETE = withApiMiddleware(async ({ req }) => {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') || ''
    const parsed = z.object({ id: z.string().min(1) }).safeParse({ id })
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const { error } = await supabase.from(TABLE).delete().eq('id', parsed.data.id)
    if (error) throw error
    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
})


