import {  NextResponse } from 'next/server'  
import { withApiMiddlewareWithoutAuth } from '@/lib/api-middleware'
import { supabase } from '@/lib/supabase'
import { getTableName } from '@/lib/supabase'
import { fromDb } from '@/app/admin/components/experience/utils'
import {
  z
} from 'zod'

const TABLE = getTableName('experiences')

export const GET = withApiMiddlewareWithoutAuth(async ({req}) => {
  //pagination
  const { searchParams } = new URL(req.url)
  const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  })
  const { page, limit } = paginationSchema.parse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  })
  const offset = (page - 1) * limit 
  //fetch data
  const { data, error, count } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .range(offset, offset + limit - 1)
    .order('date', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  //map to db
  const mappedData = data.map(fromDb)
  return NextResponse.json({ experiences: mappedData, total: count ?? 0})
})
