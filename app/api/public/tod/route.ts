import { withApiMiddlewareWithoutAuth } from '@/lib/api-middleware'
import { getTableName } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const table = getTableName('thought_of_the_day')

export const GET = withApiMiddlewareWithoutAuth(async () => {
  // get all active items from the table
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'No active thoughts found' }, { status: 404 })
  }

  // pick a random item from the array
  const randomIndex = Math.floor(Math.random() * data.length)
  const item = data[randomIndex]

  return NextResponse.json({
    quote: item.quote,
    author: item.author,
    url: item.url,
    authorImageUrl: item.authorImageUrl,
  })
})