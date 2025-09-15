import { NextResponse } from 'next/server'
import { withApiMiddleware } from '@/lib/api-middleware'
import { supabase, getTableName } from '@/lib/supabase'
import { z } from 'zod'

const TABLE = getTableName('projects')

/**
 * GET /api/projects
 * Supports pagination: ?page=1&limit=10
 * Supports filtering: ?search=keyword&activeType=0|1|2
 * Suupoo
 */
export const GET = withApiMiddleware(async ({ req }) => {
  try {
    const { searchParams } = new URL(req.url)

    const paginationSchema = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
      search: z.string().optional().nullable(),
      activeType: z.coerce.number().int().max(2).default(0),
    })

    const { page, limit, search, activeType } = paginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      activeType: searchParams.get("activeType") ?? undefined,
    })

    const offset = (page - 1) * limit

    // Build query dynamically
    let query = supabase
      .from(TABLE)
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // only filter when needed
    if (activeType === 1) query = query.eq("is_active", true)
    if (activeType === 2) query = query.eq("is_active", false)

    if (search && search.trim() !== "") {
      query = query.ilike("name", `%${search.trim()}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      projects: data ?? [],
      total: count ?? 0,
      page,
      limit,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    )
  }
})

/**
 * POST /api/projects
 * Creates a new project
 */

//type  
const projectType = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).min(1),
  images: z.array(z.string()).min(1),
  github: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  playstore: z.string().optional().nullable(),
  appstore: z.string().optional().nullable(),
  org_name: z.string().optional().nullable(),
  org_logo: z.string().optional().nullable(),
  org_url: z.string().optional().nullable(),
})


export const POST = withApiMiddleware(async ({ json }) => {
  const body = await json()
  const parsed = projectType.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { name, description, tags, images, github, website, playstore, appstore, org_name, org_logo, org_url } = parsed.data


  const payload = {
    name: name,
    description: description,
    tags: Array.isArray(tags) ? tags : [],
    images: Array.isArray(images) ? images : [],
    github: github || null,
    website: website || null,
    playstore: playstore || null,
    appstore: appstore || null,
    org_name: org_name || null,
    org_logo: org_logo || null,
    org_url: org_url || null,
    is_active: true
  }
  //create table if not exists

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ project: data }, { status: 201 })
})

export const PATCH = withApiMiddleware(async ({ json }) => {
  const body = await json()
  const updateSchema = projectType.extend({ id: z.string().min(1), is_active: z.boolean().optional().nullable() })
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const payload = {
    name: parsed.data.name,
    description: parsed.data.description,
    tags: parsed.data.tags,
    images: parsed.data.images,
    github: parsed.data.github || null,
    website: parsed.data.website || null,
    playstore: parsed.data.playstore || null,
    appstore: parsed.data.appstore || null,
    org_name: parsed.data.org_name || null,
    org_logo: parsed.data.org_logo || null,
    org_url: parsed.data.org_url || null,
    is_active: parsed.data.is_active || true
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq('id', parsed.data.id)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ project: data }, { status: 200 })
})

/**
 * DELETE /api/projects?id=<uuid>
 * Deletes a project by id
 */
export const DELETE = withApiMiddleware(async ({ req }) => {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')
    const schema = z.object({ id: z.string().min(1) })
    const parsed = schema.safeParse({ id: idParam || '' })
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', parsed.data.id)

    if (error) throw error
    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
})
