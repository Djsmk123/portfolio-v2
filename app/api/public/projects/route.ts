import {  NextResponse } from 'next/server'  
import { withApiMiddlewareWithoutAuth } from '@/lib/api-middleware'
import { supabase } from '@/lib/supabase'
import { getTableName } from '@/lib/supabase'
import {
  z
} from 'zod'
const TABLE = getTableName('projects')

export const GET = withApiMiddlewareWithoutAuth(async ({req}) => {
  const { searchParams } = new URL(req.url)

    const paginationSchema = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
    })

    const { page, limit } = paginationSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    
    })

    const offset = (page - 1) * limit

    // Build query dynamically
    const query = supabase
      .from(TABLE)
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .eq("is_active", true)
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      projects: data ?? [],
      total: count ?? 0
    })
})
