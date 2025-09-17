import { NextResponse } from 'next/server'
import { withApiMiddleware } from '@/lib/api-middleware'
import { supabase, getTableName } from '@/lib/supabase'
import { z } from 'zod'

const TABLE = getTableName('resumes')

const schema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  is_active: z.boolean().optional().nullable(),
  is_default: z.boolean().optional().nullable()
})

export const GET = withApiMiddleware(async ({ req }) => {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Math.min(Number(searchParams.get('limit') || 20), 100)
  const offset = (page - 1) * limit
  const { data, error, count } = await supabase.from(TABLE).select('*', { count: 'exact' }).order('updated_at', { ascending: false }).range(offset, offset + limit - 1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resumes: data ?? [], total: count ?? 0, page, limit })
})

export const POST = withApiMiddleware(async ({ json }) => {
  const body = await json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const payload = { ...parsed.data, is_active: parsed.data.is_active ?? true, is_default: parsed.data.is_default ?? (parsed.data.is_active ?? false) }
  if (payload.is_active) {
    await supabase.from(TABLE).update({ is_active: false }).neq('id', '')
  }
  if (payload.is_default) {
    await supabase.from(TABLE).update({ is_default: false }).neq('id', '')
  }
  const { data, error } = await supabase.from(TABLE).insert(payload).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resume: data }, { status: 201 })
})

export const PATCH = withApiMiddleware(async ({ json }) => {
  const body = await json()
  const updateSchema = schema.extend({ id: z.string().min(1) })
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const payload = { ...parsed.data }
  if (payload.is_active) {
    await supabase.from(TABLE).update({ is_active: false }).neq('id', payload.id)
  }
  if (payload.is_default) {
    await supabase.from(TABLE).update({ is_default: false }).neq('id', payload.id)
  }
  const { data, error } = await supabase.from(TABLE).update({ name: payload.name, url: payload.url,  is_active: payload.is_active ?? false, is_default: payload.is_default ?? false }).eq('id', payload.id).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resume: data }, { status: 200 })
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


