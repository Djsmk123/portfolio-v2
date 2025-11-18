import { withApiMiddlewareWithoutAuth } from "@/lib/api-middleware"
import { getTableName } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

const table = getTableName('skills')


export const GET = withApiMiddlewareWithoutAuth(async () => {
  const { data, error } = await supabase.from(table).select('*').eq('is_active', true)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
})

export const OPTIONS = withApiMiddlewareWithoutAuth(async () => {
  return new NextResponse(null, { status: 204 })
})