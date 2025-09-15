import { NextResponse } from 'next/server'
import { withApiMiddleware } from '@/lib/api-middleware'

export const runtime = 'nodejs'

export const GET = withApiMiddleware(async () => {
  return NextResponse.json({ ok: true })
})

export const POST = withApiMiddleware(async ({ json }) => {
  const body = await json()
  // process incoming admin payload generically for now
  return NextResponse.json({ received: body })
})


