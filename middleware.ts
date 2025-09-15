import { NextResponse, type NextRequest } from 'next/server'

function isLikelySupabaseAuthenticated (req: NextRequest): boolean {
  // Supabase sets sb-access-token/sb-refresh-token cookies in the browser
  const hasAccess = req.cookies.has('sb-access-token')
  const hasRefresh = req.cookies.has('sb-refresh-token')
  // Also allow an admin secret header for server-to-server/API testing
  const adminSecret = process.env.ADMIN_SECRET
  const headerSecret = req.headers.get('x-admin-secret')
  const isHeaderAuthed = adminSecret && headerSecret && adminSecret === headerSecret
  // Allow Authorization: Bearer <access_token>
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
  const hasBearer = Boolean(authHeader && /^Bearer\s+.+/i.test(authHeader))
  return Boolean(hasAccess || hasRefresh || isHeaderAuthed || hasBearer)
}

export function middleware (req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminApi = pathname.startsWith('/api/admin')

  if (!isAdminApi) return NextResponse.next()

  const authenticated = isLikelySupabaseAuthenticated(req)

  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Handle CORS for admin APIs
  const res = NextResponse.next()
  const origin = req.headers.get('origin') || '*'
  res.headers.set('Access-Control-Allow-Origin', origin)
  res.headers.set('Vary', 'Origin')
  res.headers.set('Access-Control-Allow-Credentials', 'true')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-secret')
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers })
  }

  return res
}

export const config = {
  matcher: ['/api/admin/:path*']
}


