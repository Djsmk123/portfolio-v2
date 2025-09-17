import { NextResponse } from 'next/server'
import { withApiMiddleware } from '@/lib/api-middleware'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { config } from '@/lib/config'

const BUCKET = config.bucket

export const GET = withApiMiddleware(async ({ req, headers }) => {
  const { searchParams } = new URL(req.url)
  const prefix = searchParams.get('prefix') || ''
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 100 })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const files = (data || []).map(f => ({
    name: f.name,
    id: `${prefix}${f.name}`,
    updated_at: f.updated_at,
    metadata: f.metadata,
    size: f.metadata?.size || 0,
    url: supabase.storage.from(BUCKET).getPublicUrl(`${prefix}${f.name}`).data.publicUrl,
  }))
  return NextResponse.json({ files })
})

export const POST = withApiMiddleware(async ({ req, headers }) => {
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.startsWith('multipart/form-data')) return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
  const form = await req.formData()
  const file = form.get('file') as File | null
  const path = String(form.get('path') || '')
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  const key = path ? `${path}/${file.name}` : file.name
  const { data, error } = await supabase.storage.from(BUCKET).upload(key, file, { upsert: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const url = supabase.storage.from(BUCKET).getPublicUrl(key).data.publicUrl
  return NextResponse.json({ key: data?.path || key, url })
})

export const DELETE = withApiMiddleware(async ({ req, headers }) => {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') || ''
  const parsed = z.object({ id: z.string().min(1) }).safeParse({ id })
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { error } = await supabase.storage.from(BUCKET).remove([parsed.data.id])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
})


