import { NextResponse } from 'next/server'  
import { withApiMiddlewareWithoutAuth } from '@/lib/api-middleware'
import { supabase } from '@/lib/supabase'
import { getTableName } from '@/lib/supabase'

const TABLE = getTableName('resumes')

export const GET = withApiMiddlewareWithoutAuth(async () => {
  // get active resume; fallback to most recently updated
  const { data: activeResume, error: activeError } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (activeError && activeError.message) {
    return NextResponse.json({ error: activeError.message }, { status: 500 })
  }

  if (activeResume) {
    return NextResponse.json({ resume: activeResume })
  }

  const { data: latestResume, error: latestError } = await supabase
    .from(TABLE)
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latestError && latestError.message) {
    return NextResponse.json({ error: latestError.message }, { status: 500 })
  }

  return NextResponse.json({ resume: latestResume ?? null })
})
