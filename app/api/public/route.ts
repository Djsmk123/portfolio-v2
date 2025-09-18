// /api/public/route.ts

import { NextResponse } from 'next/server'
import { withApiMiddlewareWithoutAuth } from '@/lib/api-middleware'

export const GET = withApiMiddlewareWithoutAuth(async () => {
  return NextResponse.json({ message: 'Hello, world!' })
})

