import { NextResponse } from 'next/server'
import { withApiMiddleware } from '@/lib/api-middleware'

export const runtime = 'nodejs'

export const POST = withApiMiddleware(async () => {
  const response = NextResponse.json({ message: 'Logged out successfully' })

  // Clear the HTTP-only cookies
  response.cookies.set('sb-access-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })

  response.cookies.set('sb-refresh-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })

  return response
})
