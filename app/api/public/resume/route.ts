import { NextResponse } from 'next/server'  
import { withApiMiddlewareWithoutAuth } from '@/lib/api-middleware'
import { supabase } from '@/lib/supabase'
import { getTableName } from '@/lib/supabase'

const TABLE = getTableName('resumes')

export const GET = withApiMiddlewareWithoutAuth(async () => {
  //get default resume
  const { data, error } = await supabase.from(TABLE).select('*').eq('is_default', true).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resume: data })
})
